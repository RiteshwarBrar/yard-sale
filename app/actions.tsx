'use server'
import { createClient } from "@/lib/supabase/server";
import { UUID } from "crypto";



export async function createListing(ListingData: any) {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const userID = userData?.user?.id;
    const {data, error} = await supabase
        .from('listings')
        .insert([{
            created_by: userID as UUID,
            item_name: ListingData.name,
            make: ListingData.make,
            model: ListingData.model,
            description: ListingData.description,
            location: ListingData.location,
            condition: ListingData.condition,
            price: ListingData.price,
        }]).select('id');
//created_by 
    console.log("Error:", error);
    console.log("Inserted listing data:", data);
    const listingID = data?.[0]?.id;
    const path = `${userID?.toString()}/${listingID?.toString()}/`;

    ListingData.media.forEach( async (file: File, index: number) => {
        // create a safe filename from the listing name + an incrementing serial (1-based)
        const originalName = (ListingData.name ?? 'file').toString();
        const slug = originalName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with hyphen
            .replace(/^-+|-+$/g, '');    // trim leading/trailing hyphens

        const ext = file?.name?.split('.').pop() ?? '';
        const filename = ext ? `${slug}-${index + 1}.${ext}` : `${slug}-${index + 1}`;
        const uploadPath = `${path}${filename}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ListingsMedia')
            .upload(uploadPath, file);
        if (uploadError) {
            console.error("Error uploading file:", uploadError);
        } else {
            console.log("File uploaded successfully:", uploadData);
        }       
    });

    // return data;
    // Implementation for creating a new listing


}