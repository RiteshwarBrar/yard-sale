import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ImageUrls } from "@/lib/types";
import { BuyPageShell } from "@/components/buy/BuyPageShell";
import { LISTINGS_BUCKET_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

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
      category,
      image_paths
    `
    )
    .neq("created_by", userID)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .range(0, 49);

  if (categoryFilter && categoryFilter.toLowerCase() !== "all") {
    listingsQuery = listingsQuery.eq("category", categoryFilter);
  }

  if (conditionFilter) {
    listingsQuery = listingsQuery.eq("condition", conditionFilter);
  }

  const { data: listings, error: listingsError } = await listingsQuery

  if (listingsError) {
    console.error("Error fetching listings:", listingsError);
    return <div>Error loading listings.</div>;
  }

  const imageUrls: ImageUrls = Object.fromEntries(
    listings.map(listing => [
      listing.id,
      listing.image_paths.map((path: string) => `${LISTINGS_BUCKET_URL}/${path}`)
    ])
  );

  //TODO: Fetch saved listing IDs for this user
  const { data: savedData } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", userID);

  const savedIds = new Set((savedData ?? []).map((s) => s.listing_id));

  return (
    <BuyPageShell
      listings={listings}
      savedIds={[...savedIds]}
      imageUrls={imageUrls}
      conditionFilter={conditionFilter}
      categoryFilter={categoryFilter}
    />
  );
}
