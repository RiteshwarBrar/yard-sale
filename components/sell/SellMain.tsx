"use client";

import { Search, Plus } from "lucide-react";
import { SellView, SellerListing } from "./types";
import { ImageUrls } from "@/components/types/types";
import { SellerListingCard } from "./SellerListingCard";
import { InsightsView } from "./InsightsView";
import { AnnouncementsView } from "./AnnouncementsView";
import { ManageView } from "./AnnouncementsView";

interface SellMainProps {
  view: SellView;
  listings: SellerListing[];
  allListings: SellerListing[];
  imageUrls: ImageUrls;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onToggleActive: (id: string) => void;
  stats: { total: number; active: number; sold: number; totalValue: number };
  onCreateListing: () => void;
}

export function SellMain({
  view, listings, allListings, imageUrls,
  searchQuery, setSearchQuery,
  onToggleActive, stats, onCreateListing,
}: SellMainProps) {

  if (view === "insights") return <InsightsView stats={stats} listings={allListings} />;
  if (view === "announcements") return <AnnouncementsView />;
  if (view === "manage") return <ManageView listings={allListings} onToggleActive={onToggleActive} />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search your listings…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>
        <span className="text-sm text-gray-400 ml-auto">
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
        </span>
      </div>

      {/* Listings */}
      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Your listings</h2>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-base font-semibold text-gray-600">No listings found</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">
              {searchQuery ? "Try a different search" : "Create your first listing to start selling"}
            </p>
            {!searchQuery && (
              <button
                onClick={onCreateListing}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-sm font-semibold rounded-lg hover:bg-[#1567d3] transition-colors"
              >
                <Plus size={15} />
                Create a listing
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map((listing) => (
              <SellerListingCard
                key={listing.id}
                listing={listing}
                images={imageUrls[listing.id] ?? []}
                onToggleActive={() => onToggleActive(listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
