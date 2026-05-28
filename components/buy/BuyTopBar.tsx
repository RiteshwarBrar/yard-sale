"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { SortOption } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/constants";

interface BuyTopBarProps {
  query: string;
  setQuery: (q: string) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  resultCount: number;
}

export function BuyTopBar({ query, setQuery, sort, setSort, resultCount }: BuyTopBarProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2 flex-1 max-w-md">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search listings by name, location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent text-sm outline-none w-full text-gray-800 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-gray-400 hover:text-gray-600 text-xs shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-sm text-gray-400 shrink-0 hidden sm:block">
        {resultCount} {resultCount === 1 ? "listing" : "listings"}
      </p>

      <div className="ml-auto flex items-center gap-2">
        {/* Sort */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white">
          <SlidersHorizontal size={14} className="text-gray-400 shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="outline-none bg-transparent text-sm text-gray-700 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
