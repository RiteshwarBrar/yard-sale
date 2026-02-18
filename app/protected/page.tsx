import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Listings } from "@/components/home/listings";
import CompleteSignUpPrompt from "@/components/complete-sign-up/complete-sign-up-prompt";
export default async function ProtectedPage() {

	const supabase = await createClient();
	const { data, error } = await supabase.auth.getClaims();
	if (error || !data?.claims) {
		redirect("/auth/login");
	}
	const { data: {user}} = await supabase.auth.getUser();
	// console.log("User :", user);
	const userID = data?.claims.sub;

	return (
		<div className="flex-1 w-full flex flex-col gap-12">
			{!user?.user_metadata.email || user?.user_metadata.email === "" ? (
				<CompleteSignUpPrompt />
			) : (
				<h1 className="text-3xl font-bold">Welcome to your home page!</h1>
			)}
			<Listings userID={userID} />
		</div>
	);
}
