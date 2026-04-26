import React from 'react'
import Profile from '@/components/profile/profile'
import { createClient } from '@/lib/supabase/server';
import { redirect } from "next/navigation";
import placeholder from "@/components/assets/images/avatar_placeholder.png";

export default async function page() {
    
    const supabase = await createClient();
        const { data, error } = await supabase.auth.getClaims();
        if (error || !data?.claims) {
            redirect("/auth/login");
        }
        const { data: { user } } = await supabase.auth.getUser();
        const email = data?.claims.user_metadata?.email;
        const username = data?.claims.user_metadata?.username || "User";
        const pfpUrl = data?.claims.user_metadata?.avatar_url || placeholder.src;
        console.log(data);    

    return (
        <Profile email={email} username={username} pfpUrl={pfpUrl}/>
    )
}
