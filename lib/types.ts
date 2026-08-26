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
export type MinimumListingData = {
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

import { CATEGORIES } from "@/lib/constants";

export type Category = (typeof CATEGORIES)[number];

import { SORT_OPTIONS } from "@/lib/constants";

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export type ProfileSection = "profile" | "security" | "email" | "phone" | "password"| "demo profile";

export const BIO_MAX_LENGTH = 300;

export interface UserProfile {
    userId: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    initials: string;
    bio?: string;
    phone_number?: string;
    created_at?: string;
}
