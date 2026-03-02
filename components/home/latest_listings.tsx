"use client";
import React from 'react'
import { ListingCard } from '@/components/explore/listingcard';
import { useRouter } from 'next/navigation';
import { ImageUrls, minimumListingData } from '@/components/types/types';

export function Listings({
    listings,
    imageUrls
}: {
    listings: Array<minimumListingData>;
    imageUrls: ImageUrls;
}) {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-4">

            <h1 className="text-3xl font-bold">See what's new</h1>
            <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-600">Explore the latest listings from our community</h2>
                <button onClick={() => router.push("/protected/explore")} className="hover:text-muted-foreground">View all {'->'}</button>
            </div>
            {listings.length > 0 ? listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} imageUrls={imageUrls} />
            ))
                : <p>No listings yet.</p>}
        </div>

    )
}
