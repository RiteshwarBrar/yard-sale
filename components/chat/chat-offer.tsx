import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

interface ChatOfferItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showUsername: boolean
  updatePendingOffersStatus?: (status: boolean) => Promise<void>
  updateOfferStatus?: (status: "Accepted" | "Rejected" | "Cancelled" | "Pending" | "Countered") => Promise<void>
  processCounterOffer?: (message: ChatMessage) => void
}

export const ChatOfferItem = ({ message, isOwnMessage, showUsername, updatePendingOffersStatus, updateOfferStatus, processCounterOffer }: ChatOfferItemProps) => {
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
          className={cn('rounded-xl w-fit flex flex-col items-center py-2 px-3',
            (message.status === "Accepted" ? 'bg-green-200 text-green-700' :
              message.status === "Rejected" ? 'bg-red-200 text-red-700' :
                isOwnMessage ? 'bg-primary text-primary-foreground':
                  'bg-muted text-foreground')
          )}
        >
          <div className="flex justify-end w-full">
            {message.status === "Pending" ?
              <button className="text-xs" onClick={() => {
                updatePendingOffersStatus && updatePendingOffersStatus(false)
                isOwnMessage ? updateOfferStatus && updateOfferStatus("Cancelled")
                  : updateOfferStatus && updateOfferStatus("Rejected")
              }}>
                x
              </button> : <div className='py-1'></div>
            }
          </div>
          <div className="flex flex-col items-center py-1 px-3">
            <p className="text-lg font-bold mt-1">${message.body}</p>
            {isOwnMessage ?
              <p className="text-xs mt-1">{message.status}</p>
              : message.status == "Pending" ? <div className="flex gap-1">
                <button className="text-xs p-1 rounded-md mt-1 text-primary-foreground bg-primary"
                  onClick={()=>{
                    processCounterOffer && processCounterOffer(message)
                  }}>Counter</button>
                <button className="text-xs p-1 rounded-md mt-1 text-primary-foreground bg-primary"
                  onClick={() => {
                    updatePendingOffersStatus && updatePendingOffersStatus(false)
                    updateOfferStatus && updateOfferStatus("Accepted")
                  }}>Accept</button>
              </div>
                : <p className="text-xs mt-1">{message.status}</p>

            }
          </div>

        </div>


      </div>
    </div>
  )
}
