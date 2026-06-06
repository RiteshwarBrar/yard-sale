// import React from "react";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { DisplayListings } from "@/components/my-listings/displayUsersListings";
// import { ImageUrls } from "@/lib/types";

// export default async function Page({
//     searchParams,
// }: {
//     searchParams: Promise<{ active?: string }>;
// }) {
//     const supabase = await createClient();
//     const { data, error } = await supabase.auth.getClaims();
//     if (error || !data?.claims) {
//         redirect("/auth/login");
//     }
//     const { active } = await searchParams;
//     const userID = data?.claims.sub;
//     const { data: listings, error: listingsError } = await supabase
//         .from('listings')
//         .select(`
//                 id,
//                 active,
//                 created_by,
//                 name:item_name,
//                 created_at,
//                 condition,
//                 make,
//                 model,
//                 description,
//                 price,
//                 location
//                 `)
//         .eq('created_by', userID)
//         .eq('active', active ? active === "true" : true)
//         .order('created_at', { ascending: false })
//         .range(0, 9);

//     if (listingsError) {
//         console.error("Error fetching active listings:", listingsError);
//         return <div>Error loading your listings.</div>;
//     }


//     const imageUrls: ImageUrls = {};

//     for (const listing of listings) {
//         const folder = `${listing.created_by}/${listing.id}`;

//         imageUrls[listing.id] = await fetchImages(folder);

//         async function fetchImages(folder: string) {
//             const { data: files, error } = await supabase
//                 .storage
//                 .from('ListingsMedia')
//                 .list(folder);

//             if (error) {
//                 console.error("Error fetching images:", error);
//                 return [];
//             }
//             if (!files || files.length === 0) {
//                 return [];
//             }
//             const filePaths = files
//                 .filter((f) => !f.name.endsWith("/")) // Exclude folders
//                 .map((f) => `${folder}/${f.name}`);

//             const { data: urls, error: urlError } = await supabase
//                 .storage
//                 .from('ListingsMedia')
//                 .createSignedUrls(filePaths, 60 * 60); // URLs valid for 60 minutes

//             if (urlError) {
//                 console.error("Error creating signed URLs:", urlError);
//                 return [];
//             }
//             return urls.map((u) => u.signedUrl);
//         }
//     }

//     return (
//         <div>
//             <DisplayListings userID={userID} listings={listings} imageUrls={imageUrls} showActiveListings={active ? active === "true" : true} />
//         </div>
//     );
// }
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SellPageShell } from "@/components/sell/SellPageShell";
import { ImageUrls } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  folder: string
): Promise<string[]> {
  const { data: files, error } = await supabase.storage
    .from("ListingsMedia")
    .list(folder);

  if (error || !files?.length) return [];

  return files
    .filter((f) => !f.name.endsWith("/"))
    .map((f) => {
      const { data } = supabase.storage
        .from("ListingsMedia")
        .getPublicUrl(`${folder}/${f.name}`);
      return data.publicUrl;
    });
}

export default async function SellPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userID = data.claims.sub;

  const [
    { data: user },
    { data: listings, error: listingsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabase.from("users").select(`
        id,
        first_name,
        last_name,
        user_name,
        email,
        avatar_url
        `).eq("id", userID).single(),
    supabase
      .from("listings")
      .select(
        `
        id,
        created_by,
        created_at,
        name:item_name,
        condition,
        description,
        price,
        location,
        category,
        active
      `
      )
      .eq("created_by", userID)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*"),
  ]);

  if (listingsError) {
    console.error("Error fetching listings:", listingsError);
    return <div>Error loading your listings.</div>;
  }

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
    return <div>Error loading categories.</div>;
  }

  const imageUrlEntries = await Promise.all(
    (listings ?? []).map(async (listing) => {
      const folder = `${listing.created_by}/${listing.id}`;
      const urls = await fetchImages(supabase, folder);
      return [listing.id, urls] as const;
    })
  );

  const imageUrls: ImageUrls = Object.fromEntries(imageUrlEntries);
//   const full_name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const displayName =
    user?.user_name ??
    "Seller";

  const avatarUrl = user?.avatar_url ?? null;
  return (
    <SellPageShell
      listings={listings ?? []}
      imageUrls={imageUrls}
      categories={categories ?? []}
      displayName={displayName}
      avatarUrl={avatarUrl}
      userID={userID}
    />
  );
}
