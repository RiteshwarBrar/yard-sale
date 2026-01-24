import React from 'react'

export function ListingPage({ listingID }: { listingID: string }) {
  return (
    <div>
      <h2>Listings for ID: {listingID}</h2>
      {/* Render the listings for the user here */}
    </div>
  )
}
