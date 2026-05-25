"use client";
import { LayoutGrid, Car, Tv, Sofa, Shirt, Bike, Wrench, Home, Gamepad2, BookOpen, Plus} from "lucide-react";
import { useState } from "react";
import { CONDITIONS, CATEGORIES } from "../types/types";

const categoryIcons = [
  {name: "All", icon: LayoutGrid },
  {name: "Vehicles", icon: Car },
  {name: "Electronics", icon: Tv },
  {name: "Home & garden", icon: Sofa },
  {name: "Apparel", icon: Shirt },
  {name: "Sports & outdoors", icon: Bike },
  {name: "Tools", icon: Wrench },
  {name: "Property rentals", icon: Home },
  {name: "Toys & games", icon: Gamepad2 },
  {name: "Books & media", icon: BookOpen },
]
// interface SidebarProps {
//   activeCategory: string;
//   setActiveCategory: (cat: string) => void;
// }

export default function Sidebar() {

  const [activeCategory, setActiveCategory] = useState("All");
  return (
    <aside className="w-72 border-r border-gray-200 flex flex-col overflow-y-auto shrink-0 bg-white">
      <div className="p-4">
        {/* <p className="text-lg font-semibold text-gray-900 mb-3">YardSale</p> */}

        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-[#1877F2] hover:bg-[#E7F3FF] transition-colors mb-1">
          <Plus size={18} />
          Create new listing
        </button>
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#E7F3FF] hover:text-[#1877F2] transition-colors mb-1">
          Browse All
        </button>
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
          {categoryIcons.map(({ name, icon: Icon }) => {
            const active = activeCategory === name;
            return (
              <button
                key={name}
                onClick={() => setActiveCategory(name)}
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
                {name}
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
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${c === "New"
                  ? "border-[#1877F2] text-[#1877F2]"
                  : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
