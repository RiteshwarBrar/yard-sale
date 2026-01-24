"use client";
import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export function AvailableItems() {
  const router = useRouter();

  const handleHomepage = () => {
    router.push("/protected");
  };


  return (
    <div>
        {/* Placeholder for available items carousel */}
        <Card onClick={handleHomepage} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Available Items for Sale</CardTitle>
                        <CardDescription>Items open for sale</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Go to homepage</p>
                    </CardContent>
                    {/* <CardFooter>
                    </CardFooter> */}
        </Card>
    </div>
  )
}
