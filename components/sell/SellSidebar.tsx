"use client";

import {
  Plus, LayoutGrid, BarChart2, Megaphone,
  Settings, ChevronDown, ChevronUp,
} from "lucide-react";
import { SellView, StatusFilter, SortOption, Category, SORT_OPTIONS } from "./types";
import { useState } from "react";

interface SellSidebarProps {
  activeView: SellView;
  setActiveView: (v: SellView) => void;
  onCreateListing: () => void;
  statusFilter: StatusFilter;
  setStatusFilter: (s: StatusFilter) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  categories: Category[];
  stats: { total: number; active: number; sold: number; totalValue: number };
  displayName: string;
  avatarUrl: string | null;
}

const NAV_ITEMS: { label: string; view: SellView; icon: React.ElementType }[] = [
  { label: "Your listings", view: "listings", icon: LayoutGrid },
  { label: "Insights", view: "insights", icon: BarChart2 },
  { label: "Announcements", view: "announcements", icon: Megaphone },
  { label: "Manage listings", view: "manage", icon: Settings },
];

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Sold", value: "sold" },
  { label: "Inactive", value: "inactive" },
];

export function SellSidebar({
  activeView, setActiveView,
  onCreateListing,
  statusFilter, setStatusFilter,
  sortBy, setSortBy,
  categoryFilter, setCategoryFilter,
  categories, stats,
  displayName, avatarUrl,
}: SellSidebarProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 overflow-y-auto flex flex-col bg-white">
      <div className="p-4 flex flex-col gap-1">

        {/* Header */}
        <div className="mb-2">
          <p className="text-xs text-gray-400 font-medium">Marketplace</p>
          <p className="text-xl font-bold text-gray-900 tracking-tight">Selling</p>
        </div>

        {/* Create CTA */}
        <button
          onClick={onCreateListing}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-[#E7F3FF] text-[#1877F2] text-sm font-semibold hover:bg-[#d4e9ff] transition-colors mb-1"
        >
          <Plus size={16} />
          Create new listing
        </button>

        <div className="h-px bg-gray-100 my-2" />

        {/* Nav items */}
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ label, view, icon: Icon }) => {
            const active = activeView === view;
            return (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-colors ${
                  active
                    ? "bg-[#E7F3FF] text-[#1877F2] font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  active ? "bg-white" : "bg-gray-100"
                }`}>
                  <Icon size={15} className={active ? "text-[#1877F2]" : "text-gray-500"} />
                </div>
                {label}
              </button>
            );
          })}
        </div>

        <div className="h-px bg-gray-100 my-2" />

        {/* Filters section */}
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex items-center justify-between w-full px-1 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
        >
          Filters
          {filtersOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {filtersOpen && (
          <div className="flex flex-col gap-4 mt-1">

            {/* Status */}
            <div>
              <p className="text-xs text-gray-400 mb-2 px-1">Status</p>
              <div className="flex flex-wrap gap-1.5 px-1">
                {STATUS_FILTERS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setStatusFilter(value)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      statusFilter === value
                        ? "bg-[#1877F2] border-[#1877F2] text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="px-1">
              <p className="text-xs text-gray-400 mb-2">Sort by</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#1877F2] bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="px-1">
              <p className="text-xs text-gray-400 mb-2">Category</p>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#1877F2] bg-white"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

          </div>
        )}

      </div>
    </aside>
  );
}
