"use client";

import { useState } from "react";
import { Heart, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ListingRow, Condition } from "@/components/types/types";

const CONDITION_STYLES: Record<Condition, string> = {

  "New": "bg-[#E7F3FF] text-[#0C447C]",
  "Like new": "bg-[#EAF3DE] text-[#27500A]",
  Used: "bg-gray-100 text-gray-600",
  Fair: "bg-[#FAEEDA] text-[#633806]",
  "For parts": "bg-red-50 text-red-600",
  "Poor": "bg-[#FBEAF0] text-[#7A1639]",
};

const PLACEHOLDER_BG = [
  "#E6F1FB", "#EAF3DE", "#FAEEDA", "#FBEAF0",
  "#E1F5EE", "#EEEDFE", "#FCEBEB", "#F1EFE8",
];

interface BuyListingCardProps {
  listing: ListingRow;
  // images: string[];
  saved: boolean;
  onToggleSave: () => void;
}

export function BuyListingCard({ listing, saved, onToggleSave }: BuyListingCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const images: string[] = []; //TODO: get real images
  const hasImages = images.length > 0;
  const bgColor = PLACEHOLDER_BG[listing.id.charCodeAt(0) % PLACEHOLDER_BG.length];

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i + 1) % images.length);
  };

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all flex flex-col"
    >
      {/* Image area */}
      <div className="relative h-36 overflow-hidden" style={{ backgroundColor: bgColor }}>
        {hasImages ? (
          <Image
            src={images[imgIndex]}
            alt={listing.name}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl select-none">
            🏷️
          </div>
        )}

        {/* Multi-image nav */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={next}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight size={13} />
            </button>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full transition-colors ${i === imgIndex ? "bg-white" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Save button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleSave();
          }}
          aria-label={saved ? "Unsave" : "Save"}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110"
        >
          <Heart
            size={13}
            className={saved ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-0.5">
        <p className="text-[15px] font-semibold text-gray-900">
          ₹{listing.price.toLocaleString("en-IN")}
        </p>
        <p className="text-[13px] text-gray-500 truncate">{listing.name}</p>
        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
          <MapPin size={10} className="shrink-0" />
          {listing.location}
        </p>
        <span
          className={`inline-block self-start text-[10px] px-2 py-0.5 rounded-full mt-1.5 font-medium ${CONDITION_STYLES[listing.condition as Condition] ?? "bg-gray-100 text-gray-500"
            }`}
        >
          {listing.condition}
        </span>
      </div>
    </Link>
  );
}
