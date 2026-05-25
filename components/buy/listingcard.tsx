"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from 'react';
import { ImageUrls, minimumListingData } from '@/components/types/types';

// export function ListingCard({
//     listing,
//     imageUrls
// }: {
//     listing: minimumListingData;
//     imageUrls: ImageUrls;
// }) {

//     const createdAt = new Date(listing.created_at).toLocaleDateString();
//     const router = useRouter();

//     const handleButton = () => {
//         const listingID = btoa(listing.id);
//         router.push(`/protected/listing-page/${listingID}/`);
//     };

//     return (
//         <Card onClick={handleButton} className="flex flex-col items-center justify-end cursor-pointer hover:shadow-lg transition-shadow">
//             <CardHeader className='grid place-items-center gap-2 w-full'>
//                 <CardTitle>{listing.name}</CardTitle>
//                 <div className='flex justify-between items-center w-[90%]'>
//                     <CardDescription >{listing.category}</CardDescription>
//                     <p className='text-sm text-muted-foreground'>{listing.location}</p>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 {
//                     imageUrls[listing.id]?.length > 0 ? (
//                         <div>
//                             <div className="w-full h-full overflow-hidden">
//                                 <img
//                                     src={imageUrls[listing.id][0]}
//                                     alt={`Image for ${listing.name}`}
//                                     className='object-cover w-full aspect-[3/4] rounded-sm'
//                                 />
//                             </div>
//                         </div>
//                     ) : (
//                         <p>No images available</p>
//                     )
//                 }
//             </CardContent>
//             <CardFooter className='flex justify-between w-full'>
//                 <p className='text-lg'>${listing.price}</p>
//                 <p className="text-sm text-muted-foreground">{createdAt}</p>
//             </CardFooter>
//         </Card>
//     );
// }
import { Heart, MapPin } from "lucide-react";

const conditionStyles: Record<string, string> = {
    "Like new": "bg-[#E7F3FF] text-[#0C447C]",
    Good: "bg-[#EAF3DE] text-[#27500A]",
    Fair: "bg-[#FAEEDA] text-[#633806]",
    Sold: "bg-gray-100 text-gray-400",
};

export function ListingCard({
    listing,
    imageUrls
}: {
    listing: minimumListingData;
    imageUrls: ImageUrls;
}) {
    //   const [saved, setSaved] = useState(listing.saved);
    const [saved, setSaved] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-300 transition-colors group">
            <div
                className="relative h-48 flex items-center justify-center text-4xl"
            // style={{ backgroundColor: listing.bgColor }}
            >
                {
                    imageUrls[listing.id]?.length > 0 ? (
                            <div className="w-full h-full overflow-hidden">
                                <img
                                    src={imageUrls[listing.id][0]}
                                    alt={`Image for ${listing.name}`}
                                    className='object-cover w-full aspect-[3/4] rounded-sm'
                                />
                            </div>
                    ) : (
                        <p>No images available</p>
                    )
                }
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setSaved((s) => !s);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center transition-transform hover:scale-110"
                    aria-label={saved ? "Unsave listing" : "Save listing"}
                >
                    <Heart
                        size={14}
                        className={saved ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                </button>
            </div>
            <div className="p-2.5">
                <p className="text-[15px] font-semibold text-gray-900">{listing.price}</p>
                <p className="text-[13px] text-gray-500 mt-0.5 truncate">{listing.name}</p>
                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin size={10} className="shrink-0" />
                    {listing.location} · {"listing.distance"}
                </p>
                <span
                    className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1.5 font-medium ${conditionStyles[listing.condition]
                        }`}
                >
                    {listing.condition}
                </span>
            </div>
        </div>
    );
}
