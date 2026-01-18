import React from "react";
import NewItemForm from "@/components/new-listing/newItemForm";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createListing } from "@/app/actions";

export default async function Page() {

    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    return (
        <div>
            <NewItemForm createNewListing={createListing}/>
        </div>
    );
}