
"use client";
import { ListingCard } from "@/components/my-listings/listingcard";
import { useEffect, useState} from "react";
import { createClient } from "@/lib/supabase/client";

export function DisplayListings({
    userID
}: {
    userID: string;
}) {
    const supabase = createClient();

    // type ListingData = {
    //     name: string;
    //     make: string;
    //     model: string;
    //     description: string;
    //     condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
    //     location: string;
    //     price: number;
    //     media: File[];
    //     };

    const [page, setPage] = useState(1);
    const [listings, setListings] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handlePageChange = (newPage: number) => {
    setPage(newPage);
    };

    useEffect(() => {

        // Fetch listings from your backend or database using Supabase table queries
        const fetchListings = async () => {
            setLoading(true);
            const offset = (page - 1) * 10;

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
                    location
                `)
                .eq('created_by', userID)
                .order('created_at', { ascending: false })
                .range(offset, offset + 9);

            if (error) {
                console.error("Error fetching listings:", error);
                setErrorMsg("Failed to load listings.");
                setLoading(false);
                return;
            }

            const fetchedListings = data;
            console.log(typeof(fetchedListings));
            console.log(fetchedListings);
            setListings(fetchedListings);
            setLoading(false);
            console.log("Listings fetched successfully", fetchedListings); // not getting any listings in returned data
        };

        if (userID) {
            fetchListings();
        } else {
            setListings([]);
        }
    }, [page, userID]);
        
    return (
        <div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                )}
            </div>
            <p className="text-red-500">{errorMsg}</p>
        </div>
    );
}