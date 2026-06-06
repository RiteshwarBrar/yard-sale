export type ListingStatus = "active" | "sold" | "archived";

export interface SellerListing {
  id: string;
  created_by: string;
  created_at: string;
  name: string;
  condition: string;
  description: string;
  price: number;
  location: string;
  category: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export type SellView = "listings" | "insights" | "announcements" | "manage";

export type StatusFilter = "all" | "active" | "sold" | "inactive";

export const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Price: high to low", value: "price_desc" },
  { label: "Price: low to high", value: "price_asc" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
