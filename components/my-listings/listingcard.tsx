"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from 'react';

export type ListingData = {
    id: string;
    name: string;
    active: boolean;
    make: string;
    model: string;
    description: string;
    condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
    location: string;
    price: number;
    created_at: string;
    created_by: string;
};
type props = {
    listing: ListingData;
};

export function ListingCard({
  listing
}: props) {

    const [imageUrls, setImageUrls] = useState<string[]>([]);
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

    async function fetchImages(){
        const folder = `${createdBy}/${listing.id}`;

        const { data: files, error } = await supabase
            .storage
            .from('ListingsMedia')
            .list(folder);

        console.log("files from list():", files, "error:", error);

        if (error) {
            console.error("Error fetching images:", error);
            return [];
        }
        if (!files || files.length === 0) {
            // Nothing in this folder; bail early and AVOID calling createSignedUrls
            return [];
        }
        const filePaths = files
            .filter((f) =>  !f.name.endsWith("/")) // Exclude folders
            .map((f) => `${folder}/${f.name}`);

        const { data: urls, error: urlError } = await supabase
            .storage
            .from('ListingsMedia')
            .createSignedUrls(filePaths, 60 * 60); // URLs valid for 60 minutes

        if (urlError) {
            console.error("Error creating signed URLs:", urlError);
            return [];
        }
        return urls.map((u) => u.signedUrl);
    }

    useEffect(() => {
        async function loadImages() {
            try {
                const imageUrls = await fetchImages();
                // console.log("Fetched image URLs:", imageUrls);
                // console.log("filePaths going to Storage:");
                setImageUrls(imageUrls);
            } catch (error) {
                console.error("Error loading images:", error);
            }
        }
        loadImages();
    }, []);

    const handleArchiveRestore = async (isActive: boolean) => {
        const { data, error } = await supabase
            .from('listings')
            .update({ active: !isActive })
            .eq('id', listing.id);
        if (error) {
            console.error("Error marking listing as sold:", error);
            return;
        }   
        // Optionally, you could also redirect the user or update the UI to reflect the change
        console.log("Listing marked as sold successfully:", data);
        router.refresh(); // Refresh the page to show the updated listing status
        // review refresh and loading
    };    

    const prev = () =>
        setIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1));
    const next = () =>
        setIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1));

    return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 my-6">
        <Card onClick={handleButton} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {   
                    imageUrls.length > 0 ? (
                        <div>
                            <div style={{ width: 400, height: 300, overflow: "hidden" }}>
                                <img
                                src={imageUrls[index]}
                                alt={`Image ${index + 1}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <button onClick={prev}>Prev</button>
                            <span> {index + 1} / {imageUrls.length} </span>
                            <button onClick={next}>Next</button>
                        </div>
                    ) : (
                        <p>No images available</p>
                    )
                }
                <p>{location}</p>
                <p>${price}</p>
            </CardContent>
            <CardFooter>
                <div className="w-full flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Posted on {new Date(createdAt).toLocaleDateString()}
                    </div>
                    <Button variant="outline" onClick={() => router.push(`/listings/${listing.id}`)}>View Details</Button>
                <Button variant="outline" onClick={() => handleArchiveRestore(isActive)}>{isActive ? "Mark as Sold" : "Restore Listing"}</Button>
                </div>
                {/* <Button variant="outline" onClick={() => router.push(`/listings/${listing.id}/edit`)}>Edit Listing</Button> */}
            </CardFooter>
        </Card>
        
    </div>
    );
}