export const CATEGORIES = [
    "All",
    "Vehicles",
    "Electronics",
    "Home & garden",
    "Apparel",
    "Sports & outdoors",
    "Tools",
    "Property rentals",
    "Toys & games",
    "Books & media",
    "Artwork",
] as const;

export const SORT_OPTIONS = [
    { label: "Newest first", value: "newest" },
    { label: "Price: low to high", value: "price_asc" },
    { label: "Price: high to low", value: "price_desc" },
] as const;

import { Condition } from "@/lib/types";

export const CONDITIONS: Condition[] = [
    "New",
    "Like new",
    "Used",
    "Fair",
    "Poor",
    "For parts",
];

export const CONDITION_STYLES: Record<Condition, string> = {
  "New": "bg-[#E7F3FF] text-[#0C447C]",
  "Like new": "bg-[#EAF3DE] text-[#27500A]",
  Used: "bg-gray-100 text-gray-600",
  Fair: "bg-[#FAEEDA] text-[#633806]",
  "For parts": "bg-red-50 text-red-600",
  "Poor": "bg-[#FBEAF0] text-[#7A1639]",
};

export const LISTINGS_BUCKET_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ListingsMedia`;

