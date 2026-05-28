"use client";

import { ImageUrls, MinimumListingData } from "@/lib/types";
import { BuyListingCard } from "./BuyListingCard";

interface BuyGridProps {
    listings: MinimumListingData[];
    imageUrls: ImageUrls;
    savedIds: Set<string>;
    toggleSaved: (id: string) => void;
}

export function BuyGrid({
    listings,
    imageUrls,
    savedIds,
    toggleSaved
}: BuyGridProps) {
    if (listings.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-base font-medium text-gray-600">No listings found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {listings.map((listing) => (
                    <BuyListingCard
                        key={listing.id}
                        listing={listing}
                        imageUrl={imageUrls[listing.id]?.[0] ?? ''}
                        saved={savedIds.has(listing.id)}
                        onToggleSave={() => toggleSaved(listing.id)}
                    />
                ))}
            </div>
        </div>
    );
}
