"use client";
import { ListingCard } from "@/components/my-listings/listingcard";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ImageUrls, ListingData } from "@/lib/types";

export function DisplayListings({
    userID,
    listings,
    imageUrls,
    showActiveListings
}: {
    userID: string;
    listings: Array<ListingData>;
    showActiveListings: boolean;
    imageUrls: ImageUrls;
}) {
    const supabase = createClient();

    // const [page, setPage] = useState(1);
    // const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function setShowActiveListings(active: boolean) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("active", active.toString());
        router.push(`${pathname}?${params.toString()}`);
    }

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
                {
                    listings.length > 0 ? listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} imageUrls={imageUrls} />
                    )) : <div>
                        <p>No {showActiveListings ? "active" : "archived"} listings yet.</p>
                    </div>
                }
            </div>
        </div>
    );
}