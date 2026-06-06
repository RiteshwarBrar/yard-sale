"use client";

import { Plus, ExternalLink, Lightbulb, HelpCircle } from "lucide-react";
import Image from "next/image";

interface SellRightPanelProps {
  onCreateListing: () => void;
  displayName: string;
  avatarUrl: string | null;
  stats: { total: number; active: number; sold: number; totalValue: number };
}

const TIPS = [
  {
    icon: "📸",
    title: "Add more photos",
    body: "Listings with 3+ photos get significantly more interest from buyers.",
  },
  {
    icon: "✏️",
    title: "Write a clear description",
    body: "Include dimensions, age, brand, and any defects to set accurate expectations.",
  },
  {
    icon: "💰",
    title: "Price competitively",
    body: "Search for similar items to see what others are charging before you list.",
  },
  {
    icon: "📍",
    title: "Set a precise location",
    body: "Buyers filter by distance — a specific area helps you show up in more searches.",
  },
];

const HELP_LINKS = [
  { label: "How to create a listing", href: "#" },
  { label: "Pricing your items", href: "#" },
  { label: "Staying safe as a seller", href: "#" },
  { label: "See all help topics", href: "#" },
];

export function SellRightPanel({ onCreateListing, displayName, avatarUrl, stats }: SellRightPanelProps) {
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-72 shrink-0 border-l border-gray-200 overflow-y-auto bg-white">
      <div className="p-4 flex flex-col gap-4">

        {/* Seller profile card */}
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Marketplace profile</p>
          <div className="flex items-center gap-3 mb-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={44}
                height={44}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#E7F3FF] flex items-center justify-center text-sm font-bold text-[#1877F2]">
                {initials}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-400">{stats.active} active listing{stats.active !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={onCreateListing}
            className="flex items-center justify-center gap-1.5 w-full py-2 border border-[#1877F2] text-[#1877F2] text-sm font-semibold rounded-lg hover:bg-[#E7F3FF] transition-colors mb-2"
          >
            <Plus size={14} /> Create new listing
          </button>
          <button className="flex items-center justify-center gap-1.5 w-full py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <ExternalLink size={14} /> See Marketplace profile
          </button>
        </div>

        {/* Tips */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={15} className="text-amber-500" />
            <p className="text-sm font-semibold text-gray-700">Selling tips</p>
          </div>
          <div className="flex flex-col gap-3">
            {TIPS.map((tip) => (
              <div key={tip.title} className="flex gap-2.5">
                <span className="text-base shrink-0 mt-0.5">{tip.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{tip.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={15} className="text-[#1877F2]" />
            <p className="text-sm font-semibold text-gray-700">Need help?</p>
          </div>
          <div className="flex flex-col gap-1">
            {HELP_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-[#1877F2] hover:underline py-1"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
