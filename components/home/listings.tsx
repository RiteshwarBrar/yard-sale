"use client";
import React from 'react'
import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { ListingCard } from '@/components/home/listingcard';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export function Listings({
    userID
}: {
    userID?: string
}) {
    const supabase = createClient();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [listings, setListings] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

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
                .neq('created_by', userID)
                .eq('active', true)
                .order('created_at', { ascending: false })
                .range(offset, offset + 9);
            if (error) {
                console.error("Error fetching listings:", error);
                setErrorMsg("Failed to load listings.");
                setLoading(false);
                return;
            }

            const fetchedListings = data;
            console.log(typeof (fetchedListings));
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
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <Button onClick={() => router.push("/protected/create-listing")}>Create new listing</Button>
                    {listings.length > 0 ? listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))
                        : <p>No listings yet.</p>}
                </div>
            )}
            <p className="text-red-500">{errorMsg}</p>
        </div>
    )
}
