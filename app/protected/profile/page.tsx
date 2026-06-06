import React from 'react'
import Profile from '@/components/profile/profile'
import { createClient } from '@/lib/supabase/server';
import { redirect } from "next/navigation";
import defaultAvatar from "@/components/assets/images/avatar_placeholder.png";
import { init } from 'next/dist/compiled/webpack/webpack';

export default async function page() {
    
    const supabase = await createClient();
        const { data, error } = await supabase.auth.getClaims();
        if (error || !data?.claims) {
            redirect("/auth/login");
        }
        const userId = data.claims.sub;
        const { data: userData } = await supabase.from("users").select("*").eq("id", userId).single();
        const email = userData?.email;
        const username = userData?.user_name;
        const first_name = userData?.first_name;
        const last_name = userData?.last_name || "";
        const avatar_url = userData?.avatar_url;
        const initials = `${first_name?.[0]}${last_name?.[0] || ""}`.toUpperCase();

        console.log(data);    

    return (
        <Profile email={email} username={username} avatar_url={avatar_url} initials={initials} userId={userId} />
    )
}
