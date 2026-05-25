"use client";
import { Search, Bell, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NavBarProps {
  // searchQuery: string;
  // setSearchQuery: (q: string) => void;
  profile: {
    user_name: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  } | null;
}

export default function NavBar({ profile }: NavBarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState(""); //TODO: set this based on route
  return (
    <header className="flex items-center gap-4 px-5 py-2.5 border-b border-gray-200 bg-white z-10 shrink-0 w-full">
      <span className="text-xl font-semibold text-[#1877F2] tracking-tight"><Link href={"/protected"} >YardSale</Link></span>

      {/* <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 flex-1 max-w-xs">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search Marketplace"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm outline-none w-full text-gray-800 placeholder-gray-400"
        />
      </div> */}

      <nav className="flex gap-1 ml-2">
        {["Buy", "Sell", "Inbox"].map((tab) => (
          <Link
            key={tab}
            href={`/protected/${tab.toLowerCase()}`}
            onClick ={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === activeTab
                ? "bg-[#E7F3FF] text-[#1877F2]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
            {tab === "Inbox" && (
              <span className="ml-1.5 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                3
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <MessageCircle size={18} className="text-gray-600" />
        </button>
        <Link href={"/protected/profile"} className="w-8 h-8 rounded-full bg-[#E7F3FF] flex items-center justify-center text-xs font-semibold text-[#1877F2]">
          {profile?.last_name ? profile?.first_name.charAt(0) + profile?.last_name.charAt(0) : profile?.first_name.charAt(0) || "G"}
        </Link>
      </div>
    </header>
  );
}
