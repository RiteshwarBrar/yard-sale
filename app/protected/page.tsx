import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Listings } from "@/components/home/listings";

export default async function ProtectedPage() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getClaims();
	if (error || !data?.claims) {
		redirect("/auth/login");
	}

	const userID = data?.claims.sub;

	return (
		<div className="flex-1 w-full flex flex-col gap-12">
			<Listings userID={userID} />
		</div>
	);
}
