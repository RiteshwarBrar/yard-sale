export interface ImageUrls {
    [key: string]: string[];
}

export type Condition = "New" | "Like new" | "Used" | "Fair" | "Poor" | "For parts";

export type ListingData = {
    id: string;
    name: string;
    make: string;
    model: string;
    description: string;
    condition: Condition;
    location: string;
    price: number;
    created_at: string;
    created_by: string;
    active: boolean;
};
export type minimumListingData = {
    id: string;
    name: string;
    price: number;
    description: string;
    created_by: string;
    created_at: string;
    location: string;
    category: string;
    condition: Condition;
};

// export type Category = {
//     id: string;
//     name: string;
// };



export interface ListingRow {
    id: string;
    created_by: string;
    created_at: string;
    name: string;
    condition: Condition;
    description: string;
    price: number;
    location: string;
    category: string;
}

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

export type Category = (typeof CATEGORIES)[number];

export const CONDITIONS: Condition[] = [
    "New",
    "Like new",
    "Used",
    "Fair",
    "Poor",
    "For parts",
];

export const SORT_OPTIONS = [
    { label: "Newest first", value: "newest" },
    { label: "Price: low to high", value: "price_asc" },
    { label: "Price: high to low", value: "price_desc" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
