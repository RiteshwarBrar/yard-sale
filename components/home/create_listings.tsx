"use client";
import React from 'react'
import { useRouter } from 'next/navigation';

export function CreateListings() {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Start Selling</h1>
            <div className="flex justify-between items-center">
                <h2 className="text-lg text-gray-600">List anything you want to sell</h2>
                <button onClick={() => router.push("/protected/create-listing")} className="hover:text-muted-foreground">Create a listing {'->'}</button>
            </div>
        </div>
    )
}