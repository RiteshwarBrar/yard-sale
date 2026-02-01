'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'

interface UseRealtimeChatProps {
  roomName: string
  seller: { id: string; display_name: string }
  buyer: { id: string; display_name: string }
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender: {
    id: string;
    display_name: string;
  }
  receiver: {
    id: string;
    display_name: string;
  }
  body: string
  created_at: string
}

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({ roomName, seller, buyer }: UseRealtimeChatProps) {
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
  }, [roomName, seller, buyer, supabase])

  const sendMessage = useCallback(
    async (body: string) => {
      if (!channel || !isConnected) return;
      if (!buyer.id || !seller.id) return;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: roomName,
          sender_id: buyer.id,
          receiver_id: seller.id,
          body,
        })
        .select(
          `
          id,
          sender:users!messages_sender_id_fkey (
              id,
              display_name
          ),
          receiver:users!messages_receiver_id_fkey (
              id,
              display_name
          ),
          conversation_id,
          body,
          created_at
        `
        ).single();

      if (error || !data) {
        console.error("Error sending message:", error);
        return;
      }

      const normalizedData = (raw: any) => ({
        id: raw.id,
        sender: { id: raw.sender.id, display_name: raw.sender.display_name },
        receiver: { id: raw.receiver.id, display_name: raw.receiver.display_name },
        conversation_id: raw.conversation_id,
        body: raw.body,
        created_at: raw.created_at,
      });

      const message = normalizedData(data);

      // Update local state immediately for the sender
      setMessages((current) => [...current, message])

      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });
    },
    [channel, isConnected, seller, buyer, roomName]
  )

  return { messages, sendMessage, isConnected }
}
