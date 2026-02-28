import React from 'react'

export default function ExplorePage() {



    return (
        <div>
            <h1 className='text-2xl font-bold'>Explore Listings</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
                {/* Example listing cards */}
                <div className='border rounded-lg p-4'>
                    <img src="/placeholder.jpg" alt="Listing Image" className="w-full h-48 object-cover rounded-md" />
                    <h2 className='text-xl font-semibold mt-4'>Vintage Camera</h2>
                    <p className='text-gray-600 mt-2'>$150</p>
                    <p className='text-gray-600 mt-2'>A classic vintage camera in excellent condition. Perfect for collectors and photography enthusiasts.</p>
                </div>
        </div>
        </div>
    );
}