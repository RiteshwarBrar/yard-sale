import React from 'react'
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingPage } from '@/components/listing-page/listing-page';

interface PageProps {
    params: Promise<{ listingID: string }>;
}

export default async function page({ params }: PageProps) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    const userID = data?.claims.sub;

    const { listingID } = await params;

    return (
        <div>
            <ListingPage listingID={listingID} userID={userID} />
        </div>
    );
}
