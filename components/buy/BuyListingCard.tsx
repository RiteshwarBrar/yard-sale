"use client";

import { useState } from "react";
import { Heart, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MinimumListingData, Condition } from "@/lib/types";
import { CONDITION_STYLES } from '@/lib/constants';

const PLACEHOLDER_BG = [
	"#E6F1FB", "#EAF3DE", "#FAEEDA", "#FBEAF0",
	"#E1F5EE", "#EEEDFE", "#FCEBEB", "#F1EFE8",
];

interface BuyListingCardProps {
	listing: MinimumListingData;
	imageUrl: string;
	saved: boolean;
	onToggleSave: () => void;
}

export function BuyListingCard({
	listing,
	imageUrl,
	saved,
	onToggleSave
}: BuyListingCardProps) {

	const bgColor = PLACEHOLDER_BG[listing.id.charCodeAt(0) % PLACEHOLDER_BG.length];

	return (
		<Link
			href={`/listing-page/${listing.id}`}
			className="group border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all flex flex-col"
		>
			{/* Image area */}
			<div className="relative h-36 overflow-hidden" style={{ backgroundColor: bgColor }}>
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={`Image for ${listing.name}`}
						fill
						className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-3xl select-none">
						🏷️
					</div>
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
