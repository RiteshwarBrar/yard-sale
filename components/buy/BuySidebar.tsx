"use client";

import {
  LayoutGrid, Car, Shirt, Sofa,
  Wrench, Gamepad2, BookOpen, Heart, ChevronDown,
  Palette, Home, Tv, Bike,
} from "lucide-react";
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

interface BuySidebarProps {
  // activeCategory: Category;
  // setActiveCategory: (c: Category) => void;
  // conditions: Condition[];
  // toggleCondition: (c: Condition) => void;
  categoryFilter?: string;
  conditionFilter?: string;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  // categoryCount: Record<string, number>;
  savedCount: number;
  showSavedOnly: boolean;
  setShowSavedOnly: (v: boolean) => void;
}

export function BuySidebar({
  // activeCategory, setActiveCategory,
  // conditions, toggleCondition,
  categoryFilter,
  conditionFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  // categoryCount,
  savedCount, showSavedOnly, setShowSavedOnly,
}: BuySidebarProps) {

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
    <aside className="w-72 shrink-0 border-r border-gray-200 overflow-y-auto flex flex-col bg-white">
      <div className="p-4 flex flex-col gap-5">

        {/* Saved toggle */}
        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${showSavedOnly
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
        >
          <Heart
            size={16}
            className={showSavedOnly ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
          <span>Saved items</span>
          {savedCount > 0 && (
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${showSavedOnly ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"
              }`}>
              {savedCount}
            </span>
          )}
        </button>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">Location</p>
        <button className="flex items-center  w-full px-3 py-2 rounded-lg text-sm font-medium text-[#1877F2] hover:bg-gray-100 transition-colors">
          Filler, City - Within 10 miles
        </button>
        <div className="h-px bg-gray-100" />
        {/* Categories */}
        <section>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Categories
          </p>
          <div className="flex flex-col gap-0.5">
            {CATEGORIES.map((cat) => {
              const active = categoryFilter === cat;
              const Icon = CATEGORY_ICONS[cat];
              // const count = categoryCount[cat] ?? 0;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    handleCategorySelection(cat)
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors ${active
                    ? "bg-[#E7F3FF] text-[#1877F2] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-white" : "bg-gray-100"
                    }`}>
                    <Icon size={15} className={active ? "text-[#1877F2]" : "text-gray-500"} />
                  </div>
                  <span className="flex-1 truncate">{cat}</span>
                  {/* {count > 0 && (
                    <span className={`text-xs ${active ? "text-[#1877F2]" : "text-gray-400"}`}>
                      {count}
                    </span>
                  )} */}
                </button>
              );
            })}
          </div>
        </section>

        <div className="h-px bg-gray-100" />

        {/* Price range */}
        <section>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Price range
          </p>
          <div className="flex gap-2 px-1">
            <div className="flex-1">
              <label className="text-[11px] text-gray-400 mb-1 block">Min (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] text-gray-400 mb-1 block">Max (₹)</label>
              <input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all"
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-gray-100" />

        {/* Condition */}
        <section>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Condition
          </p>
          <div className="flex flex-col gap-1.5 px-1">
            {CONDITIONS.map((c) => (
              // const checked = conditions.includes(c);
              // return (
              //   <label
              //     key={c}
              //     className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${checked ? "bg-[#E7F3FF] text-[#1877F2]" : "text-gray-700 hover:bg-gray-50"
              //       }`}
              //   >
              //     <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-[#1877F2] border-[#1877F2]" : "border-gray-300"
              //       }`}>
              //       {checked && (
              //         <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              //           <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              //         </svg>
              //       )}
              //     </div>
              //     <input
              //       type="checkbox"
              //       className="sr-only"
              //       checked={checked}
              //       onChange={() => toggleCondition(c)}
              //     />
              //     {c}
              //   </label>
              // );
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
        </section>

        {/* Reset */}
        {(selectedCondition !== "None" || minPrice || maxPrice) && (
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setSelectedCondition("None");
              handleConditionSelection("None", true);
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
