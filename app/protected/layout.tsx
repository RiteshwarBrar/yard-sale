import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { Chat } from "@/components/chat/chat";
import NavBar from "@/components/home/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data: profile } = await supabase
        .from("users")
        .select("user_name, first_name, last_name, avatar_url")
        .eq("id", userId)
        .single(); 

    return (
        <main className="min-h-screen flex flex-col items-center">
                <NavBar profile={profile} />
                <div className="flex-1 flex flex-col h-screen w-full max-w-7xl px-5">
                    {children}
                    <Chat />
                </div>

                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                    <ThemeSwitcher />
                </footer>
        </main>
    );
}
