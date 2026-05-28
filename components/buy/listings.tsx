"use client";
import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { ListingCard } from '@/components/buy/listingcard';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ImageUrls, MinimumListingData, Category } from '@/lib/types';

export function Listings({
    listings,
    categories,
    selectedCategory,
    imageUrls
}: {
    listings: Array<MinimumListingData>;
    categories: Category[];
    selectedCategory: string;
    imageUrls: ImageUrls;
}) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function handleCategorySelection(category: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (category === "all") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-16">
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-center">Shop the categories</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <Button key="all" variant="outline" onClick={() => handleCategorySelection("all")}>
                        All
                    </Button>
                    {categories.map((category) => (
                        <Button key={category} variant="outline" onClick={() => handleCategorySelection(category)}>
                            {category}
                        </Button>
                    ))}

                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-center">Currently available for Sale</h1>
                <div className="gap-4 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {listings.length > 0 ? listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} imageUrls={imageUrls} />
                    ))
                        : <p>No listings yet.</p>}
                </div>
            </div>
        </div>
    )
}
