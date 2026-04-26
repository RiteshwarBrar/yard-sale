"use client";
import React from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Profile({
    email,
    username,
    pfpUrl
}: {
    email: string;
    username: string;
    pfpUrl: string;
}) {
    const router = useRouter();
    return (
        <div>
            <h1 className='text-2xl font-bold'>Your Profile</h1>
            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-10'>
                <div className='justify-end flex-col'>
                    <img src={pfpUrl} alt="Profile Picture" className="w-32 h-32 rounded-full mt-4 bg-black" />
                    <p className="mt-4 text-gray-600">Username: {username}</p>
                    <p className="text-gray-600">Email: {email}</p>
                </div>
                <div className='border rounded-lg p-4'>
                    <h2 className='text-xl font-semibold mt-4'>Your Active Listings</h2>
                    <p className='text-gray-600 mt-2'>You have no active listings. Start selling your items today!</p>
                    <Button
                        className='mt-5'
                        onClick={() => router.push("/protected/my-listings")}
                    >Your Listings</Button>

                </div>
                {/* <div className='border rounded-lg p-4'>
                    <h2 className='text-xl font-semibold mt-4'>Purchase History</h2>
                    <p className='text-gray-600 mt-2'>You have not made any purchases yet. Explore items and find something you like!</p>
                    <Button className='mt-5'>View History</Button>
                </div> */}
            </div>
        </div>
    )
}