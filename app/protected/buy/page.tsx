// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { Listings } from "@/components/explore/listings";
// import { minimumListingData, ImageUrls } from "@/components/types/types";

// export default async function ProtectedPage({
//     searchParams,
// }: {
//     searchParams: Promise<{ category?: string }>;
// }) {
//     const supabase = await createClient();
//     const { data, error } = await supabase.auth.getClaims();
//     if (error || !data?.claims) {
//         redirect("/auth/login");
//     }
//     const { category: categoryFilter } = await searchParams;
//     const { data: { user } } = await supabase.auth.getUser();
//     const userID = data?.claims.sub;

//     let query = supabase
//         .from('listings')
//         .select(`
//                     id,
//                     created_by,
//                     created_at,
//                     name:item_name, 
//                     condition,
//                     description,
//                     price,
//                     location,
//                     category
//                 `)
//         .neq('created_by', userID)
//         .eq('active', true)
//         .order('created_at', { ascending: false })
//         .range(0, 9);

//     if (categoryFilter) {
//         query = query.eq('category', categoryFilter)
//     }
    
//     const { data: listings, error: listingsError } = await query

//     if (listingsError) {
//         console.error("Error fetching listings:", listingsError);
//         return <div>Error loading listings.</div>;
//     }

//     const { data: categories, error: categoriesError } = await supabase
//         .from('categories')
//         .select('*');

//     if (categoriesError) {
//         console.error("Error fetching categories:", categoriesError);
//         return <div>Error loading categories.</div>;
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
//         <Listings listings={listings} imageUrls={imageUrls} categories={categories} selectedCategory={categoryFilter || "all"} />
//     );
// }
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
// import { Listings } from "@/components/buy/listings";
import { minimumListingData, ImageUrls } from "@/components/types/types";
import { BuyPageShell } from "@/components/buy/BuyPageShell";

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

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; condition?: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { category: categoryFilter, condition: conditionFilter } = await searchParams;
  const userID = data.claims.sub;

  // Build listings query — apply category filter at DB level when present
  let listingsQuery = supabase
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
      category
    `
    )
    .neq("created_by", userID)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .range(0, 49);

  if (categoryFilter && categoryFilter !== "All") {
    listingsQuery = listingsQuery.eq("category", categoryFilter);
  }

  if (conditionFilter) {
    listingsQuery = listingsQuery.eq("condition", conditionFilter);
  }

  // Fetch listings and categories in parallel
  const [{ data: listings, error: listingsError }, { data: categories, error: categoriesError }] =
    await Promise.all([listingsQuery, supabase.from("categories").select("*")]);

  if (listingsError) {
    console.error("Error fetching listings:", listingsError);
    return <div>Error loading listings.</div>;
  }

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
    return <div>Error loading categories.</div>;
  }

  // Fetch all listing images in parallel using public URLs
  const imageUrlEntries = await Promise.all(
    (listings ?? []).map(async (listing: minimumListingData) => {
      const folder = `${listing.created_by}/${listing.id}`;
      const urls = await fetchImages(supabase, folder);
      return [listing.id, urls] as const;
    })
  );

  const imageUrls: ImageUrls = Object.fromEntries(imageUrlEntries);

  // Fetch saved listing IDs for this user
  const { data: savedData } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", userID);

  const savedIds = new Set((savedData ?? []).map((s) => s.listing_id));

  return (
    <BuyPageShell
      listings={listings}
      savedIds={[...savedIds]}
    />
  );
}
