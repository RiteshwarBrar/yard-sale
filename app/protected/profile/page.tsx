import React from 'react'
import ProfilePageShell from '@/components/profile/ProfilePageShell'
import { createClient } from '@/lib/supabase/server';
import { redirect } from "next/navigation";
import defaultAvatar from "@/components/assets/images/avatar_placeholder.png";
import { UserProfile } from '@/lib/types';
import { init } from 'next/dist/compiled/webpack/webpack';

export default async function page() {
    
    const supabase = await createClient();
        const { data, error } = await supabase.auth.getClaims();
        if (error || !data?.claims) {
            redirect("/auth/login");
        }
        const userId = data.claims.sub;
        const { data: userData } = await supabase.from("users").select("*").eq("id", userId).single();
        const first_name = userData?.first_name;
        const last_name = userData?.last_name || "";
        const initials = `${first_name?.[0]}${last_name?.[0] || ""}`.toUpperCase();
     

        // console.log(data);
        const profile:UserProfile = {
            email: userData?.email,
            phone_number: userData?.phone,
            username: userData?.user_name,
            avatar_url: userData?.avatar_url || defaultAvatar.src,
            initials: initials,
            userId: userId,
            first_name: first_name,
            last_name: last_name,
            bio: userData?.bio || "",
            created_at: userData?.created_at,
        };    

    return (
        <ProfilePageShell profile={profile} />
    )
}
