"use client";

import { TrendingUp, Eye, MessageCircle, Tag } from "lucide-react";
import { SellerListing } from "./types";

interface InsightsViewProps {
  stats: { total: number; active: number; sold: number; totalValue: number };
  listings: SellerListing[];
}

export function InsightsView({ stats, listings }: InsightsViewProps) {
  const categoryCounts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.category] = (acc[l.category] ?? 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const STAT_CARDS = [
    { label: "Total listings", value: stats.total, icon: Tag, color: "bg-[#E7F3FF] text-[#1877F2]" },
    { label: "Active", value: stats.active, icon: TrendingUp, color: "bg-green-50 text-green-700" },
    { label: "Sold", value: stats.sold, icon: Eye, color: "bg-amber-50 text-amber-700" },
    {
      label: "Active value",
      value: `₹${stats.totalValue.toLocaleString("en-IN")}`,
      icon: MessageCircle,
      color: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">Insights</h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="border border-gray-200 rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={16} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {topCategories.length > 0 && (
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Listings by category</h3>
          <div className="flex flex-col gap-3">
            {topCategories.map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{cat}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1877F2] rounded-full transition-all"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        Detailed analytics like views and messages will appear here once available.
      </p>
    </div>
  );
}
