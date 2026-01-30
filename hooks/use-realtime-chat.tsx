'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'

interface UseRealtimeChatProps {
  roomName: string
  sender: string
  receiver: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  receiver_id: string
  body: string
  created_at: string
}

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({ roomName, sender, receiver }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newChannel = supabase.channel(roomName)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        setMessages((current) => [...current, payload.payload as ChatMessage])
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [roomName, sender, receiver, supabase])

  const sendMessage = useCallback(
    async (body: string) => {
      if (!channel || !isConnected) return

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        body,
        conversation_id: roomName,
        sender_id: sender,
        receiver_id: receiver,
        created_at: new Date().toISOString(),
      }

      // Update local state immediately for the sender
      setMessages((current) => [...current, message])

      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      })
    },
    [channel, isConnected, sender, receiver]
  )

  return { messages, sendMessage, isConnected }
}
