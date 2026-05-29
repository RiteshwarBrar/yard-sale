"use client";
import { LayoutGrid, Car, Tv, Sofa, Shirt, Bike, Wrench, Home, Gamepad2, BookOpen, Plus, Palette, ChevronDown } from "lucide-react";
import { useState } from "react";
import { CONDITIONS, CATEGORIES } from "../../lib/constants";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";

const CATEGORY_ICONS = {
    "All": LayoutGrid,
    "Vehicles": Car,
    "Electronics": Tv,
    "Home & garden": Sofa,
    "Apparel": Shirt,
    "Sports & outdoors": Bike,
    "Tools": Wrench,
    "Property rentals": Home,
    "Toys & games": Gamepad2,
    "Books & media": BookOpen,
    "Artwork": Palette,
}
interface SidebarProps {
    //   activeCategory: string;
    //   setActiveCategory: (cat: string) => void;
    categoryFilter?: string;
    conditionFilter?: string
}

export default function HomeSidebar({
    categoryFilter = "All",
    conditionFilter = "None"
}: SidebarProps) {

    const [activeCategory, setActiveCategory] = useState(categoryFilter);
    const [selectedCondition, setSelectedCondition] = useState(conditionFilter);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function handleCategorySelection(category: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (category === "All") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    function handleConditionSelection(condition: string, deselect: boolean) {
        const params = new URLSearchParams(searchParams.toString());
        if (deselect) {
            params.delete("condition");
        } else {
            params.set("condition", condition);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <aside className="w-72 border-r border-gray-200 flex flex-col overflow-y-auto shrink-0 bg-white">
            <div className="p-4">
                {/* <p className="text-lg font-semibold text-gray-900 mb-3">YardSale</p> */}

                <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-[#1877F2] hover:bg-[#E7F3FF] transition-colors mb-1">
                    <Plus size={18} />
                    Create new listing
                </button>
                <Link href="/protected/buy" className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#E7F3FF] hover:text-[#1877F2] transition-colors mb-1">
                    Browse All
                </Link>
                <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#E7F3FF] hover:text-[#1877F2] transition-colors mb-1">
                    Notifications
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#E7F3FF] hover:text-[#1877F2] transition-colors mb-1">
                    Inbox
                </button>
                {/* <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#E7F3FF] hover:text-[#1877F2] transition-colors mb-1">
          Access
        </button>
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#E7F3FF] hover:text-[#1877F2] transition-colors mb-1">
          Browse All
        </button> */}

                <div className="h-px bg-gray-200 my-3" />
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Location</p>
                <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-[#1877F2] hover:bg-gray-100 transition-colors mb-1">
                    Filler, City - Within 10 miles
                </button>

                <div className="h-px bg-gray-200 my-3" />

                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Categories</p>

                <div className="flex flex-col gap-0.5">
                    {CATEGORIES.map((cat) => {
                        const active = activeCategory === cat;
                        const Icon = CATEGORY_ICONS[cat];
                        return (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat)
                                    handleCategorySelection(cat)
                                }}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left w-full ${active
                                    ? "bg-[#E7F3FF] text-[#1877F2] font-medium"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-[#E7F3FF]" : "bg-gray-100"
                                        }`}
                                >
                                    <Icon size={16} className={active ? "text-[#1877F2]" : "text-gray-500"} />
                                </div>
                                {cat}
                            </button>
                        );
                    })}
                </div>

                <div className="h-px bg-gray-200 my-4" />

                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Filters</p>

                <div className="px-1">
                    <p className="text-xs text-gray-500 mb-2">Condition</p>
                    <div className="grid grid-cols-3 gap-2 justify-items-left">
                        {CONDITIONS.map((c) => (
                            <button
                                key={c}
                                onClick={() => {
                                    handleConditionSelection(c, c === selectedCondition);
                                    c === selectedCondition ? setSelectedCondition("None") : setSelectedCondition(c);
                                }}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${c === selectedCondition
                                    ? "border-[#1877F2] text-[#1877F2]"
                                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
                {(selectedCondition !== "None") && (
                    <button
                        onClick={() => {
                            setSelectedCondition("None");
                            // conditions reset via parent — pass through
                        }}
                        className="text-xs text-[#1877F2] hover:underline text-left px-1 flex items-center gap-1"
                    >
                        <ChevronDown size={12} className="rotate-90" />
                        Clear all filters
                    </button>
                )}
            </div>
        </aside>
    );
}
