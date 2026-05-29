import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HomeGrid } from "@/components/home/HomeGrid";
import { ImageUrls } from "@/lib/types";
import CompleteSignUpPrompt from "@/components/complete-sign-up/complete-sign-up-prompt";
import { LISTINGS_BUCKET_URL } from "@/lib/constants";
import HomeSidebar from "@/components/home/HomeSidebar";

export default async function ProtectedPage({
	searchParams
}: {
	searchParams: Promise<{ category?: string; condition?: string }>;
}) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getClaims();

	if (error || !data?.claims) {
		redirect("/auth/login");
	}
	const { data: { user } } = await supabase.auth.getUser();
	
	const { category: categoryFilter, condition: conditionFilter } = await searchParams;
	const userID = data.claims.sub;

	let listingsQuery = supabase
		.from('listings')
		.select(`
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
				`)
		.neq('created_by', userID)
		.eq('active', true)
		.order('created_at', { ascending: false })
		.range(0, 9);

	if (categoryFilter && categoryFilter.toLowerCase() !== "all") {
		listingsQuery = listingsQuery.eq('category', categoryFilter)
	}
	if (conditionFilter) {
		listingsQuery = listingsQuery.eq('condition', conditionFilter)
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

	//TODO: Build functionality to fetch saved listing IDs and enable saving/unsaving listings for the user

	return (

		<div className="flex flex-col bg-white font-sans w-full min-h-screen">
			{!user?.user_metadata.email || user?.user_metadata.email === "" ? (
				<CompleteSignUpPrompt />
			) : null}

			{/* <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
			<div className="flex flex-1 overflow-hidden">
				<HomeSidebar
					categoryFilter={categoryFilter}
					conditionFilter={conditionFilter}
				/>
				{/* <ListingGrid {} /> */}
				<div className="flex-1 overflow-y-auto p-5 bg-white">
					<HomeGrid
						listings={listings}
						imageUrls={imageUrls}
					// savedIds={new Set()}
					// toggleSaved={(id: string) => { }} // TODO: Implement saved functionality
					/>
				</div>
			</div>


		</div>
	);
}
