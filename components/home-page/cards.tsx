"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

export function HomepageCards({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const router = useRouter();

    const handleCreateButton = () => {  
    router.push("/protected/new-listing");
    };

    const handleViewListingsButton = () => {
    };

    return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 my-6">
        <Card onClick={handleViewListingsButton} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>Current Listings</CardTitle>
                <CardDescription>Open items that you have put up for sale</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Place Holder for icon.</p>
            </CardContent>
            {/* <CardFooter>
            </CardFooter> */}
        </Card>
        <Card onClick={handleCreateButton} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>New Listing</CardTitle>
              <CardDescription>Put an item up for sale</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Place Holder for icon.</p>
            </CardContent>
            {/* <CardFooter>
            </CardFooter> */}
        </Card>
    </div>
    );
}