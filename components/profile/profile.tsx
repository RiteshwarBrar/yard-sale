"use client";
import React from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AvatarChangeModal } from '@/components/profile/AvatarChangeModal';
import Image from 'next/image';

export default function Profile({
    email,
    username,
    avatar_url,
    initials,
    userId: userId
}: {
    email: string;
    username: string;
    avatar_url: string;
    initials: string;
    userId: string;
}) {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = React.useState(false);
    const handleAvatarClick = () => {

    };

    return (
        <div>
            <h1 className='text-2xl font-bold'>Your Profile</h1>
            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-10'>
                <div className='justify-end flex-col'>
                    <button onClick={() => setModalOpen(true)} className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {avatar_url ? (
                            <img src={avatar_url} alt="Avatar" className="object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-lg font-medium text-blue-700">
                                {initials}
                            </div>
                        )}
                    </button>
                    <p className="mt-4 text-gray-600">Username: {username}</p>
                    <p className="text-gray-600">Email: {email}</p>
                </div>
                <AvatarChangeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} userId={userId} currentAvatarUrl={avatar_url} />
                <div className='border rounded-lg p-4'>
                    <h2 className='text-xl font-semibold mt-4'>Your Active Listings</h2>
                    <p className='text-gray-600 mt-2'>You have no active listings. Start selling your items today!</p>
                    <Button
                        className='mt-5'
                        onClick={() => router.push("/protected/sell")}
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