"use client";

import { Bell, Info } from "lucide-react";
import { SellerListing } from "./types";
import Link from "next/link";

// ── Announcements ────────────────────────────────────────────────────────────

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Keep your listings up to date",
    body: "Marking items as sold reduces unwanted messages and ensures transparency for potential buyers.",
    date: "Today",
    type: "info" as const,
  },
  {
    id: 2,
    title: "New: Category filters for buyers",
    body: "Buyers can now filter by category, condition, and price. Make sure your listings have accurate details to appear in relevant searches.",
    date: "3 days ago",
    type: "update" as const,
  },
  {
    id: 3,
    title: "Tip: Add more photos to sell faster",
    body: "Listings with 3 or more photos receive significantly more messages. Try adding multiple angles of your item.",
    date: "1 week ago",
    type: "tip" as const,
  },
];

export function AnnouncementsView() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">Announcements</h2>
      <div className="flex flex-col gap-3">
        {ANNOUNCEMENTS.map((a) => (
          <div key={a.id} className="border border-gray-200 rounded-xl p-4 flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              a.type === "info" ? "bg-[#E7F3FF]" :
              a.type === "update" ? "bg-green-50" : "bg-amber-50"
            }`}>
              {a.type === "tip"
                ? <Info size={15} className="text-amber-600" />
                : <Bell size={15} className={a.type === "info" ? "text-[#1877F2]" : "text-green-600"} />
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{a.title}</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{a.body}</p>
              <p className="text-xs text-gray-400 mt-2">{a.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Manage Listings ───────────────────────────────────────────────────────────

interface ManageViewProps {
  listings: SellerListing[];
  onToggleActive: (id: string) => void;
}

export function ManageView({ listings, onToggleActive }: ManageViewProps) {
  const active = listings.filter((l) => l.active);
  const inactive = listings.filter((l) => !l.active);

  const Section = ({ title, items }: { title: string; items: SellerListing[] }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{title} ({items.length})</h3>
      <div className="flex flex-col gap-2">
        {items.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl px-4 py-3 bg-white">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{l.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">₹{l.price.toLocaleString("en-IN")} · {l.category}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/listings/${l.id}/edit`}
                className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => onToggleActive(l.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  l.active
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {l.active ? "Mark sold" : "Relist"}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">No {title.toLowerCase()} listings</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">Manage listings</h2>
      <Section title="Active" items={active} />
      <Section title="Inactive" items={inactive} />
    </div>
  );
}
