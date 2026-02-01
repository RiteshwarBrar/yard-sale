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
    const [seller, setSeller] = useState<{ id: string; display_name: string }>({ id: "", display_name: "" });
    const [buyer, setBuyer] = useState<{ id: string; display_name: string }>({ id: "", display_name: "" });
    const [messages, setMessages] = useState<Array<any>>([]);



    const chatVisible = CHAT_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    // if (!chatVisible) {
    //     return null;
    // }

    useEffect(() => {

        const fetchConversations = async () => {
            const userID = await getUserID();
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    id,
                    seller:users!conversations_seller_id_fkey (
                        id,
                        display_name
                    ),
                    buyer:users!conversations_buyer_id_fkey (
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
                    .select(`
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
                    `)
                    .eq('conversation_id', chatRoom)
                    .order('created_at', { ascending: true });
                if (error) {
                    console.error("Error fetching messages:", error);
                    return;
                }
                setMessages(data || []);
                const openConversation = conversations.find((conversation) => conversation.id === chatRoom);
                if (openConversation) {
                    setSeller({
                        id: openConversation.seller.id,
                        display_name: openConversation.seller.display_name || "",
                        });
                        setBuyer({
                            id: openConversation.buyer.id,
                            display_name: openConversation.buyer.display_name || "",
                        });
                    }

                console.log("Messages fetched successfully", data);
            }
            fetchMessages();
        }
    }, [isChatroomOpen, chatRoom, conversations]);

    return (
        <div className="sticky bottom-6 right-6 h-96 z-40 flex flex-col items-end gap-4">
            <div className="fixed bottom-60 h-80 flex pr-4 gap-4">
                {isChatroomOpen && (
                    <div className="bg-white p-4 border rounded shadow-lg">
                        <RealtimeChat roomName={chatRoom} seller={seller} buyer={buyer} messages={messages}/>
                    </div>
                )}
                {isOpen && (
                    <div className="bg-white border w-80 flex flex-col-reverse rounded-xl shadow-lg">
                        {conversations.map((conversation) => (
                            <div onClick={() => {setIsChatroomOpen(true); setChatRoom(conversation.id); }} key={conversation.id} className="pr-4 pl-4 border-t border-black hover:bg-gray-100">
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
