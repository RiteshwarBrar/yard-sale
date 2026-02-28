"use client";
import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { ListingCard } from '@/components/explore/listingcard';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { ImageUrls, minimumListingData } from '@/components/types/types';

export function Listings({
    listings,
    imageUrls
}: {
    listings: Array<minimumListingData>;
    imageUrls: ImageUrls;
}) {

    return (
        <div>
            {listings.length > 0 ? listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} imageUrls={imageUrls} />
            ))
                : <p>No listings yet.</p>}
        </div>

    )
}
