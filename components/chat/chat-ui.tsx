"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChat } from '@/components/realtime-chat'

const CHAT_PATHS = ['protected/'];//, 'protected/listing-page/[listingID]/'];

export function ChatUI() {

    const getUserID = async () => {
        const supabase = createClient();
        const user = await supabase.auth.getUser();
        return user.data.user?.id || "";
    }

    const supabase = createClient();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isChatroomOpen, setIsChatroomOpen] = useState(false);
    const [conversations, setConversations] = useState<Array<any>>([]);
    const [chatRoom, setChatRoom] = useState<string>("");
    const [sender, setSender] = useState<string>("");
    const [receiver, setReceiver] = useState<string>("");
    const [messages, setMessages] = useState<Array<any>>([]);



    const chatVisible = CHAT_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    // if (!chatVisible) {
    //     return null;
    // }

    useEffect(() => {

        const fetchConversations = async () => {
            const userID = await getUserID();
            setSender(userID);
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    id,
                    seller:users!conversations_seller_id_fkey (
                        id,
                        display_name
                    ),
                    listing:listings!conversations_listing_id_fkey (
                        item_name
                    )
                    `)
                .eq('buyer_id', userID);
            if (error) {
                console.error("Error fetching conversations:", error);
                return;
            }
            setConversations(data || []);
            if (data && data.length > 0 && data[0].seller && data[0].seller[0]) {
                setReceiver(data[0].seller[0].id ||"");
            }
            console.log("Conversations fetched successfully", data);
        };

        fetchConversations();
    }, [isOpen]);

    useEffect(() => {
        if (!isChatroomOpen) {
            setChatRoom("");
        }
        else {

            const fetchMessages = async () => {
                const { data, error } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', chatRoom)
                    .order('created_at', { ascending: true });
                if (error) {
                    console.error("Error fetching messages:", error);
                    return;
                }
                setMessages(data || []);
                console.log("Messages fetched successfully", data);
            }
            fetchMessages();
        }
    }, [isChatroomOpen]);

    return (
        <div className="sticky bottom-6 right-6 h-96 z-40 flex flex-col items-end gap-4">
            <div className="fixed bottom-60 h-80 flex pr-4 gap-4">
                {isChatroomOpen && (
                    <div className="p-4 border rounded shadow-lg">
                        <RealtimeChat roomName={chatRoom} sender={sender} receiver={receiver} messages={messages}/>
                    </div>
                )}
                {isOpen && (
                    <div className="border w-80 flex flex-col-reverse rounded-xl shadow-lg">
                        {conversations.map((conversation) => (
                            <div onClick={() => { setIsChatroomOpen(true); setChatRoom(conversation.id); }} key={conversation.id} className="p-4 border-b">
                                <p className="p-2">Conversation with {conversation.seller.display_name} about {conversation.listing.item_name}</p>
                                <p>{conversation.id}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button
                onClick={() => { setIsOpen(!isOpen); setIsChatroomOpen(false);}}
                className="fixed bottom shadow-lg hover:bg-blue-700 transition"
            >
                CHAT!!!
            </Button>
        </div>
    )
}
