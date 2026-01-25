"use client";
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react'
import { ListingData } from '../home/listingcard';
import { Button } from '../ui/button';

export function ListingPage({ listingID, userID }: { listingID: string, userID: string }) {

    const supabase = createClient();

    const [listing, setListing] = useState<ListingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [name, setName] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState(0);
    const [createdAt, setCreatedAt] = useState("");
    const [createdBy, setCreatedBy] = useState("");

    const decodedID = atob(listingID);
    // Fetch listings from your backend or database using Supabase table queries

    async function fetchListings(): Promise<ListingData> {
        const { data, error } = await supabase
            .from('listings')
            .select(`
                        id,
                        created_by,
                        name:item_name, 
                        created_at,
                        condition,
                        make,
                        model,
                        description,
                        price,
                        location,
                        active
                    `)
            .eq('id', decodedID)
            .eq('active', true)
            .limit(1);
        if (error || !data) throw new Error("Listing not found");
        console.log("Listings fetched successfully", data);
        return data[0];
    };

    async function fetchImages(folder: string): Promise<string[]> {

        const { data: files, error } = await supabase
            .storage
            .from('ListingsMedia')
            .list(folder);

        console.log("Folder:", folder, "files from list():", files, "error:", error);
        console.log("createdBy:", createdBy, "decodedID:", decodedID);
        if (error) {
            console.error("Error fetching images:", error);
            return [];
        }
        if (!files || files.length === 0) {
            // Nothing in this folder; bail early and AVOID calling createSignedUrls
            return [];
        }
        const filePaths = files
            .filter((f) => !f.name.endsWith("/")) // Exclude folders
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
    };

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await fetchListings();
                setName(data?.name);
                setMake(data?.make);
                setModel(data?.model);
                setDescription(data?.description);
                setLocation(data?.location);
                setPrice(data?.price);
                setCreatedAt(data?.created_at);
                setCreatedBy(data?.created_by);
                const folder = `${data?.created_by}/${decodedID}`;
                const urls = await fetchImages(folder);
                setImageUrls(urls);
                setLoading(false);

            } catch (error) {
                console.error("Error loading listing data:", error);
            }
        }

        if (userID) {
            loadData();
        } else {
            setListing(null);
        }
    }, []);

    const prev = () =>
        setIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1));
    const next = () =>
        setIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1));

    const handleContactSeller = () => {
        // Implement contact seller functionality here
        alert("Contact Seller functionality to be implemented.");
    }

    return (

        <div>
            {
                loading ? (
                    <p> Loading...</p >
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 my-6">
                        <div>
                            <h1>{name}</h1>
                            <p>{description}</p>
                        </div>
                        <div>
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
                        </div>
                        <div>
                            <p>{location}</p>
                            <p>${price}</p>
                            <Button onClick={handleContactSeller}>Contact Seller</Button>
                        </div>
                    </div>
                )
            }
            <p className="text-red-500">{errorMsg}</p>
        </div>
    )
}
