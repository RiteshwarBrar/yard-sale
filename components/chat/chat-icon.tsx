"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChat } from '@/components/realtime-chat'

const CHAT_PATHS = ['protected/'];//, 'protected/listing-page/[listingID]/'];

export function ChatIcon() {

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
    const [username, setUsername] = useState<string>("");



    const chatVisible = CHAT_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    // if (!chatVisible) {
    //     return null;
    // }

    useEffect(() => {

        const fetchConversations = async () => {
            const userID = await getUserID();
            setUsername(userID);
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    id,
                    seller:users!conversations_seller_id_fkey (
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

    return (
        <div className="sticky bottom-6 right-6 z-40 flex flex-col items-end gap-4">
            <div className="flex pr-4 gap-4 items-end">
                {isChatroomOpen && (
                    <div className="p-4 bg-white border rounded shadow-lg">
                        <RealtimeChat roomName={chatRoom} username={username} />
                    </div>
                )}
                {isOpen && (
                    <div className="flex flex-col max-h-96 overflow-y-auto bg-white border rounded shadow-lg">
                        {conversations.map((conversation) => (
                            <div onClick={() => { setIsChatroomOpen(true); setChatRoom(conversation.id); }} key={conversation.id} className="p-4 border-b">
                                <p>Conversation with {conversation.seller.display_name} about {conversation.listing.item_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button
                onClick={() => { setIsOpen(!isOpen); setIsChatroomOpen(false); }}
                className="bottom shadow-lg hover:bg-blue-700 transition"
            >
                CHAT!!!
            </Button>
        </div>
    )
}
