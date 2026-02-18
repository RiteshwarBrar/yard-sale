
"use client";
import { ListingCard } from "@/components/my-listings/listingcard";
import { useEffect, useState} from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function DisplayListings({
    userID
}: {
    userID: string;
}) {
    const supabase = createClient();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [listings, setListings] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showActiveListings, setShowActiveListings] = useState(true); // TO-DO on reload the previous state of active/archived listings is not preserved, consider adding a toggle or tabs to switch between active and archived listings and preserve the state on reload

    useEffect(() => {

        const fetchListings = async () => {
            setLoading(true);
            const offset = (page - 1) * 10;

            const { data, error } = await supabase
                .from('listings')
                .select(`
                    id,
                    active,
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
                .eq('active', showActiveListings)
                .order('created_at', { ascending: false })
                .range(offset, offset + 9);

            if (error) {
                console.error("Error fetching listings:", error);
                setErrorMsg("Failed to load listings.");
                setLoading(false);
                return;
            }

            const fetchedListings = data;
            // console.log(typeof(fetchedListings));
            // console.log(fetchedListings);
            setListings(fetchedListings);
            setLoading(false);
            // console.log("Listings fetched successfully", fetchedListings);
        };

        if (userID) {
            fetchListings();
        } else {
            setListings([]);
        }
    }, [page, userID, showActiveListings]);
        
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <Button onClick={() => setShowActiveListings(true)}>Active</Button>
                    <Button onClick={() => setShowActiveListings(false)}>Archived</Button>
                </div>
            </div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {listings.length > 0 ? listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))
                        : (
                            <div>
                                <p>No {showActiveListings ? "active" : "archived"} listings yet.</p>
                                {showActiveListings && <Button onClick={() => router.push("/protected/create-listing")}>Create a listing</Button>}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p className="text-red-500">{errorMsg}</p>
        </div>
    );
}