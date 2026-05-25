"use client";
import React from 'react'
import { Sparkles } from "lucide-react";
import { ListingCard } from '@/components/buy/listingcard';
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
        // <div className="flex flex-col gap-4">

        //     <h1 className="text-3xl font-bold">See what's new</h1>
        //     <div className="flex justify-between items-center">
        //         <h2 className="text-lg text-gray-600">Explore the latest listings from our community</h2>
        //         <button onClick={() => router.push("/protected/explore")} className="hover:text-muted-foreground">View all {'->'}</button>
        //     </div>
        //     {listings.length > 0 ? listings.map((listing) => (
        //         <ListingCard key={listing.id} listing={listing} imageUrls={imageUrls} />
        //     ))
        //         : <p>No listings yet.</p>}
        // </div>

        <main className="flex-1 overflow-y-auto p-5 bg-white">
            <div className="flex items-center gap-3 bg-[#E7F3FF] border border-[#B5D4F4] rounded-xl px-4 py-3 mb-5">
                <Sparkles size={20} className="text-[#1877F2] shrink-0" />
                <div>
                    <p className="text-sm font-medium text-[#0C447C]">Today&apos;s picks near Ludhiana</p>
                    <p className="text-xs text-[#185FA5] mt-0.5">Fresh listings within 10 km of you</p>
                </div>
            </div>

            <h2 className="text-base font-semibold text-gray-900 mb-3">Recently listed</h2>

            {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-sm">No listings found</p>
                    <p className="text-xs mt-1">Try a different search or category</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} imageUrls={imageUrls} />
                    ))}
                </div>
            )}
        </main>

    )
}
