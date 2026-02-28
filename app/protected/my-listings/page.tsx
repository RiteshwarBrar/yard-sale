import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DisplayListings } from "@/components/my-listings/displayUsersListings";

export default async function Page() {

    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    const userID = data?.claims.sub;

    return (
        <div>
            <DisplayListings userID={userID} />
        </div>
    );
}