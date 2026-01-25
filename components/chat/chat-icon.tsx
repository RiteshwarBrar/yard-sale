"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';

const CHAT_PATHS = ['protected/'];//, 'protected/listing-page/[listingID]/'];

export function ChatIcon() {

    const getUserID = async () => {
        const supabase = createClient();
        const user = await supabase.auth.getUser();
        return user.data.user?.id || null;
    }

    const supabase = createClient();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isSpecificChatOpen, setIsSpecificChatOpen] = useState(false);
    const [conversations, setConversations] = useState<Array<any>>([]);

    

    const chatVisible = CHAT_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    // if (!chatVisible) {
    //     return null;
    // }

    useEffect(() => {

        const fetchConversations = async () => {
            const userID = await getUserID();
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
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
                {isSpecificChatOpen && (
                    <p className="p-4 bg-white border rounded shadow-lg">
                        Specific Chat Placeholder
                    </p>
                )}
                {isOpen && (
                    <div className="flex flex-col max-h-96 overflow-y-auto bg-white border rounded shadow-lg">
                        {conversations.map((conversation) => (
                            <div key={conversation.id} className="p-4 border-b">
                                <p>Conversation with {conversation.seller_id}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="bottom shadow-lg hover:bg-blue-700 transition"
            >
                CHAT!!!
            </Button>
        </div>
    )
}
