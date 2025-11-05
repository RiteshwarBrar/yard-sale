import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import Products, { type Product } from "@/components/products";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }
//   const demo: Product[] = [
//   {
//     id: "1",
//     name: "Minimal Leather Backpack",
//     slug: "minimal-leather-backpack",
//     imageUrl:
//       null,
//     price: 15900,
//     currency: "USD",
//     badge: "New",
//   },
//   {
//     id: "2",
//     name: "Everyday Sneakers",
//     slug: "everyday-sneakers",
//     imageUrl:
//       null,
//     price: 8900,
//     currency: "USD",
//   },
// ];

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h2 className="font-bold text-3xl mb-4">Your Items</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 my-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Listings</CardTitle>
              <CardDescription>Open items that you have put up for sale</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Place Holder for icon.</p>
            </CardContent>
            <CardFooter>
              <button className="px-4 py-2 rounded bg-primary text-primary-foreground">View</button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>New Listing</CardTitle>
              <CardDescription>Put an item up for sale</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Place Holder for icon.</p>
            </CardContent>
            <CardFooter>
              <button className="px-4 py-2 rounded bg-primary text-primary-foreground">Create</button>
            </CardFooter>
          </Card>
        </div>
        <h2 className="font-bold text-3xl mb-4">Suggested Items</h2>
        {/* <Products products={demo}/> */}
      </div>
    </div>
  );
}