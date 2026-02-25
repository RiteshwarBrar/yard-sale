'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/chat/chat-message'
import { ChatOfferItem } from '@/components/chat/chat-offer'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { type ChatMessage, useRealtimeChat } from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Chat } from './chat/chat'

interface RealtimeChatProps {
  roomName: string
  seller: { id: string; user_name: string }
  buyer: { id: string; user_name: string }
  isUserSeller: boolean
  pendingOffers?: boolean
  updateOfferStatus?: (offerID: string, status: "Accepted" | "Rejected" | "Cancelled" | "Pending" | "Countered") => Promise<void>
  updatePendingOffersStatus?: (chatRoom: string, status: boolean) => Promise<void>
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

/**
 * Realtime chat component
 * @param roomName - The name of the room to join. Each room is a unique chat.
 * @param sender - The username of the user
 * @param receiver - The username of the receiver
 * @param onMessage - The callback function to handle the messages. Useful if you want to store the messages in a database.
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomName,
  seller,
  buyer,
  isUserSeller,
  pendingOffers,
  onMessage,
  updatePendingOffersStatus,
  updateOfferStatus,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    seller,
    buyer,
    isUserSeller,
  })
  const [newMessage, setNewMessage] = useState('')
  const [showOfferWindow, setShowOfferWindow] = useState(false)
  const [showCounterOfferWindow, setShowCounterOfferWindow] = useState(false)
  const [prevOffer, setPrevOffer] = useState<ChatMessage | null>(null)
  const [newOffer, setNewOffer] = useState(0)

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) => a.created_at.localeCompare(b.created_at))

    return sortedMessages
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return

      sendMessage(newMessage)
      setNewMessage('')
    },
    [newMessage, isConnected, sendMessage]
  )
  const handleSendOffer = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (newOffer == 0 || !isConnected) return
      sendMessage(newOffer.toString(), 'offer')
      updatePendingOffersStatus && updatePendingOffersStatus(roomName, true)
      setNewOffer(0)
      setShowOfferWindow(false)
      if (updateOfferStatus && prevOffer) {
        updateOfferStatus(prevOffer.id, "Countered")
        setPrevOffer(null)
      }
    },
    [newOffer, isConnected, sendMessage]
  )

  const processCounterOffer = (prevOffer: ChatMessage) => {
    setPrevOffer(prevOffer)
    setShowOfferWindow(true)
    return;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : null}
        <div className="space-y-1">
          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showUsername = !prevMessage || prevMessage.sender.id !== message.sender.id
            const showTime = !prevMessage || prevMessage.sender.id !== message.sender.id || ((new Date(message.created_at).getTime() / 60000) - (new Date(prevMessage.created_at).getTime() / 60000)) <= 1

            // console.log("Previous message", prevMessage && (new Date(message.created_at).getTime()/60000) - (new Date(prevMessage.created_at).getTime()/60000))
            return (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                {message.type === 'offer' ? (
                  message.status === "Cancelled" ?
                    <div className="text-xs text-muted-foreground">An offer was cancelled by {message.sender.user_name}</div> :
                    <ChatOfferItem
                      message={message}
                      isOwnMessage={message.sender.id === (isUserSeller ? seller.id : buyer.id)}
                      showUsername={showUsername}
                      updatePendingOffersStatus={updatePendingOffersStatus ? (status: boolean) => updatePendingOffersStatus(roomName, status) : undefined}
                      updateOfferStatus={updateOfferStatus ? (status: "Accepted" | "Rejected" | "Cancelled" | "Pending" | "Countered") => updateOfferStatus(message.id, status) : undefined}
                      processCounterOffer={processCounterOffer ? (message: ChatMessage) => processCounterOffer(message) : undefined}
                    />
                ) : <ChatMessageItem
                  message={message}
                  isOwnMessage={message.sender.id === (isUserSeller ? seller.id : buyer.id)}
                  showUsername={showUsername}
                  showTime={showTime}
                />}

              </div>
            )
          })}
        </div>
      </div>
      {showOfferWindow && (
        <div className="inset-0 z-50 flex items-center justify-center">
          <div className="w-[90%] max-w-sm rounded-3xl bg-[#1c1c1e] px-5 py-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h1 className="text-lg text-white">$</h1>
              <Input
                className="rounded-full bg-background text-sm p-2transition-all duration-300"
                type="number"
                value={newOffer}
                onChange={(e) => setNewOffer(Number(e.target.value))}
                placeholder="Enter offer amount..."
                disabled={!isConnected}
              />
              {isConnected && newOffer && (
                <Button
                  className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
                  onClick={handleSendOffer}
                  disabled={!isConnected}
                >
                  <Send className="size-4" />
                </Button>
              )}
              <button
                onClick={() => {
                  setShowOfferWindow(false)
                  setPrevOffer(null)
                }}
                className="text-sm font-medium text-gray-400 hover:text-gray-200 p-2 transition"
              >
                x
              </button>
            </div>


          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex w-full gap-2 border-t border-border p-4">
        {!isUserSeller &&
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            onClick={() => setShowOfferWindow(true)}
            disabled={!isConnected || pendingOffers}
          >
            $
          </Button>
        }
        <Input
          className={cn(
            'rounded-full bg-background text-sm transition-all duration-300',
            isConnected && newMessage.trim() ? 'w-[calc(100%-36px)]' : 'w-full'
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        {isConnected && newMessage.trim() && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
            disabled={!isConnected}
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
