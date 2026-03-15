"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from 'react';
import { ListingData, ImageUrls } from "@/components/types/types"

export function ListingCard({
    listing,
    imageUrls
}: {
    listing: ListingData;
    imageUrls: ImageUrls;
}) {

    const [index, setIndex] = useState(0);
    const isActive = listing.active;
    const name = listing.name;
    const make = listing.make;
    const model = listing.model;
    const description = listing.description;
    const location = listing.location;
    const price = listing.price;
    const createdAt = listing.created_at;
    const createdBy = listing.created_by;
    const router = useRouter();
    const supabase = createClient();

    const handleButton = () => {

    };

    const handleArchiveRestore = async (isActive: boolean) => {
        const { data, error } = await supabase
            .from('listings')
            .update({ active: !isActive })
            .eq('id', listing.id);
        if (error) {
            console.error("Error marking listing as sold:", error);
            return;
        }
        console.log("Listing marked as sold successfully:", data);
        router.refresh();
    };

    const prev = () =>
        setIndex((i) => (i === 0 ? imageUrls[listing.id]?.length - 1 : i - 1));
    const next = () =>
        setIndex((i) => (i === imageUrls[listing.id]?.length - 1 ? 0 : i + 1));

    return (
        <Card onClick={handleButton} className="w-full h-100 cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className='gap-2'>
                <CardTitle>{name}</CardTitle>
                <CardDescription className='line-clamp-4 hover:line-clamp-none hover:z-100'>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {
                    imageUrls[listing.id]?.length > 0 ? (
                        <div>
                            <div className="w-full aspect-[10/11] overflow-hidden rounded-sm">
                                <img
                                    src={imageUrls[listing.id][index]}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button onClick={prev}>Prev</button>
                            <span> {index + 1} / {imageUrls[listing.id]?.length} </span>
                            <button onClick={next}>Next</button>
                        </div>
                    ) : (
                        <p>No images available</p>
                    )
                }
                <div className="w-full flex justify-between items-top gap-2">
                    <div className='mt-2'>
                        <p className='text-lg'>${price}</p>
                        <p className='text-sm text-muted-foreground mt-1'>{location}</p>
                    </div>
                    <div className="flex items-end text-sm text-muted-foreground">
                        Posted on {new Date(createdAt).toLocaleDateString()}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="w-full flex justify-between items-center">
                    <Button variant="outline" onClick={() => router.push(`/listings/${listing.id}`)}>View Details</Button>
                    <Button variant="outline" onClick={() => handleArchiveRestore(isActive)}>{isActive ? "Mark as Sold" : "Restore Listing"}</Button>
                </div>
                {/* <Button variant="outline" onClick={() => router.push(`/listings/${listing.id}/edit`)}>Edit Listing</Button> */}
            </CardFooter>
        </Card>
    );
}