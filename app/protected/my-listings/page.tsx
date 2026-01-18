import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DisplayListings } from "@/components/my-listings/displaylistings";

export default async function Page() {

    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const userID = data?.claims.sub;

    if (error || !data?.claims || !userID) {
        redirect("/auth/login");
    }
    
    return (
        <div>
            <h1>My Listings</h1>
            <DisplayListings userID={userID} />
            
        </div>
    );
}