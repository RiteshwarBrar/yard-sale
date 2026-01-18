import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {HomepageCards} from '@/components/home-page/cards';

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h2 className="font-bold text-3xl mb-4">Your Items</h2>
        <HomepageCards/>
        <h2 className="font-bold text-3xl mb-4">Suggested Items</h2>
        {/* <Products products={demo}/> */}
      </div>
    </div>
  );
}