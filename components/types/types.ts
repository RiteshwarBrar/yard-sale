export interface ImageUrls {
  [key: string]: string[];
}

export type ListingData = {
    id: string;
    name: string;
    make: string;
    model: string;
    description: string;
    condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
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
    condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
};