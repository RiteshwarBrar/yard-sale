import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import avatar_placeholder from "@/components/assets/images/avatar_placeholder.png";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  console.log('avatar url:', user?.user_metadata?.avatar_url);
  return user ? (
    <div className="flex items-center gap-2">
      <img
        src={(!user?.user_metadata?.avatar_url || user?.user_metadata?.avatar_url === "placeholder") ? avatar_placeholder.src : user?.user_metadata?.avatar_url}
        alt="Profile Picture"
        className="w-8 h-8 rounded-full border-2 border-black object-cover"
      />
      <p className="text-sm pr-4">{user.user_metadata?.user_name || user.user_metadata?.name || "User"}</p>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
