"use client";
import { ListingCard } from "@/components/my-listings/listingcard";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageUrls, ListingData } from "@/components/types/types";

export function DisplayListings({
    userID,
    activeListings,
    archivedListings,
    imageUrls
}: {
    userID: string;
    activeListings: Array<ListingData>;
    archivedListings: Array<ListingData>;
    imageUrls: ImageUrls;
}) {
    const supabase = createClient();
    const router = useRouter();

    // const [page, setPage] = useState(1);
    // const [loading, setLoading] = useState(false);
    const [showActiveListings, setShowActiveListings] = useState(true); // TO-DO on reload the previous state of active/archived listings is not preserved, consider adding a toggle or tabs to switch between active and archived listings and preserve the state on reload


    return (
        <div className="flex flex-col justify-between gap-6">
            <Button className="w-full" onClick={() => router.push("/protected/create-listing")}>Create new listing</Button>
            <div className="flex flex-col items-center">
                <h1>My Listings</h1>
                <div className="flex justify-betweens">
                    <div className="flex gap-2">
                        <Button onClick={() => setShowActiveListings(true)}>Active</Button>
                        <Button onClick={() => setShowActiveListings(false)}>Archived</Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 my-6">
                {showActiveListings ? (
                    activeListings.length > 0 ? activeListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} imageUrls={imageUrls} />
                    )) : <div>
                        <p>No {showActiveListings ? "active" : "archived"} listings yet.</p>
                    </div>
                ) : (
                    archivedListings.length > 0 ? archivedListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} imageUrls={imageUrls} />
                    )) : <div>
                        <p>No {showActiveListings ? "active" : "archived"} listings yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}