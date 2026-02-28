"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from 'react';
import { ImageUrls, minimumListingData } from '@/components/types/types';

export function ListingCard({
    listing,
    imageUrls
}: {
    listing: minimumListingData;
    imageUrls: ImageUrls;
}) {

    const name = listing.name;
    const description = listing.description;
    const price = listing.price;
    const createdAt = new Date(listing.created_at).toLocaleDateString();
    const router = useRouter();


    const handleButton = () => {
        const listingID = btoa(listing.id);
        router.push(`/protected/listing-page/${listingID}/`);
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-4">
            <Card onClick={handleButton} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {
                        imageUrls[listing.id]?.length > 0 ? (
                            <div>
                                <div style={{ width: 400, height: 300, overflow: "hidden" }}>
                                    <img
                                        src={imageUrls[listing.id][0]}
                                        alt={`Image for ${name}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p>No images available</p>
                        )
                    }
                </CardContent>
                <CardFooter>
                    <div>
                        <p>${price}</p>
                        <p className="text-sm text-gray-500">{createdAt}</p>
                    </div>
                </CardFooter>
            </Card>

        </div>
    );
}