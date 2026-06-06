"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Share2, Pencil, CheckCircle, Circle, ChevronRight } from "lucide-react";
import { SellerListing } from "./types";

interface SellerListingCardProps {
  listing: SellerListing;
  images: string[];
  onToggleActive: () => void;
}

export function SellerListingCard({ listing, images, onToggleActive }: SellerListingCardProps) {
  const [sharing, setSharing] = useState(false);
  const hasImage = images.length > 0;
  const PLACEHOLDER_BG = ["#E6F1FB","#EAF3DE","#FAEEDA","#EEEDFE","#E1F5EE","#FCEBEB"];
  const bg = PLACEHOLDER_BG[listing.id.charCodeAt(0) % PLACEHOLDER_BG.length];

  const handleShare = async () => {
    setSharing(true);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/listings/${listing.id}`);
    } finally {
      setTimeout(() => setSharing(false), 1500);
    }
  };

  const formattedDate = new Date(listing.created_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`flex gap-4 p-4 rounded-xl border transition-all ${
      listing.active
        ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        : "border-gray-100 bg-gray-50"
    }`}>
      {/* Thumbnail */}
      <div
        className="w-24 h-24 rounded-lg overflow-hidden shrink-0 relative"
        style={{ backgroundColor: bg }}
      >
        {hasImage ? (
          <Image
            src={images[0]}
            alt={listing.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🏷️</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/listings/${listing.id}`}
              className="text-[15px] font-semibold text-gray-900 hover:text-[#1877F2] transition-colors line-clamp-1"
            >
              {listing.name}
            </Link>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              ₹{listing.price.toLocaleString("en-IN")}
            </p>
          </div>
          <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
            listing.active
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}>
            {listing.active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
          {listing.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {listing.location}
            </span>
          )}
          <span>{listing.category}</span>
          <span>Listed {formattedDate}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={onToggleActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              listing.active
                ? "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                : "border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            {listing.active ? (
              <><Circle size={13} /> Mark as sold</>
            ) : (
              <><CheckCircle size={13} /> Mark as available</>
            )}
          </button>

          <Link
            href={`/listings/${listing.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={13} /> Edit
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={13} />
            {sharing ? "Copied!" : "Share"}
          </button>

          <Link
            href={`/listings/${listing.id}`}
            className="ml-auto flex items-center gap-1 text-xs text-[#1877F2] hover:underline"
          >
            View <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
