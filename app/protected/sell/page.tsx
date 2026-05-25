import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DisplayListings } from "@/components/my-listings/displayUsersListings";
import { ImageUrls } from "@/components/types/types";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ active?: string }>;
}) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }
    const { active } = await searchParams;
    const userID = data?.claims.sub;
    const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select(`
                id,
                active,
                created_by,
                name:item_name,
                created_at,
                condition,
                make,
                model,
                description,
                price,
                location
                `)
        .eq('created_by', userID)
        .eq('active', active ? active === "true" : true)
        .order('created_at', { ascending: false })
        .range(0, 9);

    if (listingsError) {
        console.error("Error fetching active listings:", listingsError);
        return <div>Error loading your listings.</div>;
    }


    const imageUrls: ImageUrls = {};

    for (const listing of listings) {
        const folder = `${listing.created_by}/${listing.id}`;

        imageUrls[listing.id] = await fetchImages(folder);

        async function fetchImages(folder: string) {
            const { data: files, error } = await supabase
                .storage
                .from('ListingsMedia')
                .list(folder);

            if (error) {
                console.error("Error fetching images:", error);
                return [];
            }
            if (!files || files.length === 0) {
                return [];
            }
            const filePaths = files
                .filter((f) => !f.name.endsWith("/")) // Exclude folders
                .map((f) => `${folder}/${f.name}`);

            const { data: urls, error: urlError } = await supabase
                .storage
                .from('ListingsMedia')
                .createSignedUrls(filePaths, 60 * 60); // URLs valid for 60 minutes

            if (urlError) {
                console.error("Error creating signed URLs:", urlError);
                return [];
            }
            return urls.map((u) => u.signedUrl);
        }
    }

    return (
        <div>
            <DisplayListings userID={userID} listings={listings} imageUrls={imageUrls} showActiveListings={active ? active === "true" : true} />
        </div>
    );
}