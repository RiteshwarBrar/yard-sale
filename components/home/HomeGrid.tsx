"use client";
import React from 'react'
import { Sparkles } from "lucide-react";
import { HomeListingCard } from '@/components/home/HomeListingCard';
import { useRouter } from 'next/navigation';
import { ImageUrls, MinimumListingData } from '@/lib/types';

interface HomeGridProps {
    listings: Array<MinimumListingData>;
    imageUrls: ImageUrls;
    savedIds?: Set<string>;
    toggleSaved?: (id: string) => void;
}

export function HomeGrid({
    listings,
    imageUrls,
    // savedIds,
    // toggleSaved
}: HomeGridProps) {
    const router = useRouter();
    return (
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
                        <HomeListingCard
                            key={listing.id}
                            listing={listing}
                            imageUrl={imageUrls[listing.id]?.[0] ?? ''}
                            // saved={savedIds.has(listing.id)}
                            // onToggleSave={() => toggleSaved(listing.id)}
                        />
                    ))}
                </div>
            )}
        </main>

    )
}
