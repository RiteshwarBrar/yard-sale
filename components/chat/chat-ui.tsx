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
    const [pendingOffers, setPendingOffers] = useState(false);
    const [seller, setSeller] = useState<{ id: string; user_name: string }>({ id: "", user_name: "" });
    const [buyer, setBuyer] = useState<{ id: string; user_name: string }>({ id: "", user_name: "" });
    const [messages, setMessages] = useState<Array<any>>([]);
    const [isUserSeller, setIsUserSeller] = useState(false);


    const chatVisible = CHAT_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    // if (!chatVisible) {
    //     return null;
    // }

    useEffect(() => {

        const fetchConversations = async (lookFor: string) => {
            const userID = await getUserID();
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    id,
                    pending_offers,
                    seller:users!conversations_seller_id_fkey (
                        id,
                        user_name
                    ),
                    buyer:users!conversations_buyer_id_fkey (
                        id,
                        user_name
                    ),
                    listing:listings!conversations_listing_id_fkey (
                        item_name
                    )
                    `)
                .eq(lookFor, userID);
            if (error) {
                console.error("Error fetching conversations:", error);
                return;
            }
            setConversations(data || []);
            console.log("Conversations fetched successfully", data);
        };
        if (isUserSeller) {
            fetchConversations('seller_id');
        }
        else {
            fetchConversations('buyer_id');
        }

    }, [isOpen, isUserSeller]);

    const updatePendingOffersStatus = async (conversationID: string, status: boolean) => {
        const { data, error } = await supabase
            .from('conversations')
            .update({ pending_offers: status })
            .eq('id', conversationID);
        if (error) {
            console.error("Error updating pending offers status:", error);
            return;
        }
        setPendingOffers(status);
    };

    const updateOfferStatus = async (messageID: string, status: string) => {
        const { data, error } = await supabase
            .from('messages')
            .update({ status })
            .eq('id', messageID);
        if (error) {
            console.error("Error updating offer status:", error);
            return;
        }
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === messageID ? { ...msg, status } : msg
            )
        );
    }

    useEffect(() => {
        if (!isChatroomOpen) {
            setChatRoom("");
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    id,
                    sender:users!messages_sender_id_fkey (
                        id,
                        user_name
                    ),
                    receiver:users!messages_receiver_id_fkey (
                        id,
                        user_name
                    ),
                    conversation_id,
                    body,
                    type,
                    status,
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
                    user_name: openConversation.seller.user_name || "",
                });
                setBuyer({
                    id: openConversation.buyer.id,
                    user_name: openConversation.buyer.user_name || "",
                });
            }

            console.log("Messages fetched successfully", data);
        }
        fetchMessages();

    }, [isChatroomOpen, chatRoom, conversations]);

    return (
        <div className="z-50 bottom-6 right-6 flex flex-col items-end gap-4">
            <div className="bottom-60 h-80 flex pr-4 gap-4">
                {isChatroomOpen && (
                    <div className="bg-white p-4 border rounded-xl shadow-lg">
                        <RealtimeChat 
                        roomName={chatRoom}
                        seller={seller}
                        buyer={buyer}
                        messages={messages}
                        isUserSeller={isUserSeller}
                        pendingOffers={pendingOffers}
                        updatePendingOffersStatus={updatePendingOffersStatus}
                        updateOfferStatus={updateOfferStatus}
                        />
                    </div>
                )}
                {isOpen && (
                    <div className="bg-white border w-80 flex flex-col-reverse rounded-xl shadow-lg">
                        {!conversations || conversations.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No conversations yet.
                            </div>
                        ) : (
                            conversations.map((conversation) => (
                                <div onClick={() => { setIsChatroomOpen(true); setChatRoom(conversation.id); setPendingOffers(conversation.pending_offers); }} key={conversation.id} className="pr-4 pl-4 border-t border-black hover:bg-gray-100">
                                    <p className="p-2">Conversation with {isUserSeller ? conversation.buyer.user_name : conversation.seller.user_name} about {isUserSeller ? "selling" : "buying"} {conversation.listing.item_name}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <div className="bottom-6 flex flex-row gap-4">
                <Button
                    onClick={() => { setIsOpen(!isOpen); setIsChatroomOpen(false); }}
                    className="shadow-lg hover:bg-blue-700 transition"
                >
                    {isUserSeller ? "Seller Chat" : "Buyer Chat"}
                </Button>
                <Button
                    onClick={() => { setIsUserSeller(!isUserSeller); setIsChatroomOpen(false); }}
                    className="shadow-lg bg-blue-400 hover:bg-blue-200 text-black transition"
                >
                    ↺ Switch Chat Mode
                </Button>
            </div>
        </div>
    )
}
