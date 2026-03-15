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

    const createdAt = new Date(listing.created_at).toLocaleDateString();
    const router = useRouter();

    const handleButton = () => {
        const listingID = btoa(listing.id);
        router.push(`/protected/listing-page/${listingID}/`);
    };

    return (
        <Card onClick={handleButton} className="flex flex-col items-center justify-end cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className='grid place-items-center gap-2 w-full'>
                <CardTitle>{listing.name}</CardTitle>
                <div className='flex justify-between items-center w-[90%]'>
                    <CardDescription >{listing.category}</CardDescription>
                    <p className='text-sm text-muted-foreground'>{listing.location}</p>
                </div>
            </CardHeader>
            <CardContent>
                {
                    imageUrls[listing.id]?.length > 0 ? (
                        <div>
                            <div className="w-full h-full overflow-hidden">
                                <img
                                    src={imageUrls[listing.id][0]}
                                    alt={`Image for ${listing.name}`}
                                    className='object-cover w-full aspect-[3/4] rounded-sm'
                                />
                            </div>
                        </div>
                    ) : (
                        <p>No images available</p>
                    )
                }
            </CardContent>
            <CardFooter className='flex justify-between w-full'>
                <p className='text-lg'>${listing.price}</p>
                <p className="text-sm text-muted-foreground">{createdAt}</p>
            </CardFooter>
        </Card>
    );
}