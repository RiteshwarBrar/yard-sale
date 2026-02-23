import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

interface ChatOfferItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showUsername: boolean
  updatePendingOffersStatus?: (status: boolean) => Promise<void>
  updateOfferStatus?: (status: "accepted" | "rejected" | "cancelled" | "pending") => Promise<void>
}

export const ChatOfferItem = ({ message, isOwnMessage, showUsername, updatePendingOffersStatus, updateOfferStatus }: ChatOfferItemProps) => {
  return (
    <div className={`flex mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
        })}
      >
        <div
          className={cn('flex items-center gap-2 text-xs px-3', {
            'justify-end flex-row-reverse': isOwnMessage,
          })}
        >
          {showUsername && <span className={'font-medium'}>{message.sender.user_name}</span>}
          <span className="text-foreground/50 text-xs">
            {new Date(message.created_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>
        <div
          className={cn('rounded-xl w-fit bg-gray-300 text-foreground flex flex-col items-center py-2 px-3',
          )}
        >
          <div className="flex justify-end w-full">
            <button className="text-xs" onClick={() => {
                  updatePendingOffersStatus && updatePendingOffersStatus(false)
                  isOwnMessage ? updateOfferStatus && updateOfferStatus("cancelled")
                  : updateOfferStatus && updateOfferStatus("rejected")
                  }}>x</button>
          </div>
          <div className={cn("flex flex-col items-center", isOwnMessage && "py-1 px-3")}>
            <p className="text-lg mt-1">${message.body}</p>
            {isOwnMessage ?
              <p className="text-xs mt-1">{message.status}</p>
              : <div className="flex gap-1">
                <button className="text-xs p-1 rounded-md mt-1 text-primary-foreground bg-primary">Counter</button>
                <button className="text-xs p-1 rounded-md mt-1 text-primary-foreground bg-primary"
                onClick={() => {
                  updatePendingOffersStatus && updatePendingOffersStatus(false)
                  updateOfferStatus && updateOfferStatus("accepted")
                  }}>Accept</button>
              </div>
            }
          </div>

        </div>


      </div>
    </div>
  )
}
