import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Listings } from "@/components/home/latest_listings";
import { CreateListings } from "@/components/home/create_listings";
import { ImageUrls } from "@/components/types/types";
import CompleteSignUpPrompt from "@/components/complete-sign-up/complete-sign-up-prompt";

export default async function ProtectedPage() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getClaims();
	if (error || !data?.claims) {
		redirect("/auth/login");
	}
	const { data: { user } } = await supabase.auth.getUser();
	const userID = data?.claims.sub;

	const { data: listings, error: listingsError } = await supabase
		.from('listings')
		.select(`
						id,
						created_by,
						created_at,
						name:item_name, 
						condition,
						description,
						price
					`)
		.neq('created_by', userID)
		.eq('active', true)
		.order('created_at', { ascending: false })
		.range(0, 9);

	if (listingsError) {
		console.error("Error fetching listings:", listingsError);
		return <div>Error loading listings.</div>;
	}
	const imageUrls: ImageUrls = {};
	for (const listing of listings) {
		const folder = `${listing.created_by}/${listing.id}`;

		imageUrls[listing.id] = await fetchImages(folder);

		async function fetchImages(folder: string) {
			const { data: files, error } = await supabase
				.storage
				.from('ListingsMedia')
				.list(folder);

			if (error) {
				console.error("Error fetching images:", error);
				return [];
			}
			if (!files || files.length === 0) {
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
		}
	}

	return (

		<div className="flex-1 w-full flex flex-col gap-12">
			{!user?.user_metadata.email || user?.user_metadata.email === "" ? (
				<CompleteSignUpPrompt />
			) : (
				<h1 className="text-5xl font-bold">YardSale</h1>
			)}
			<CreateListings />
			<Listings listings={listings} imageUrls={imageUrls} />

		</div>
	);
}
