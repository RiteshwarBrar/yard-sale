"use client";

import { useState, useMemo } from "react";
import { ImageUrls } from "@/components/types/types";
import { SellerListing, SellView, StatusFilter, SortOption, Category } from "./types";
import { SellSidebar } from "./SellSidebar";
import { SellMain } from "./SellMain";
import { SellRightPanel } from "./SellRightPanel";
import { CreateListingModal } from "./CreateListingModal";

interface SellPageShellProps {
  listings: SellerListing[];
  imageUrls: ImageUrls;
  categories: Category[];
  displayName: string;
  avatarUrl: string | null;
  userID: string;
}

export function SellPageShell({
  listings: initialListings,
  imageUrls,
  categories,
  displayName,
  avatarUrl,
  userID,
}: SellPageShellProps) {
  const [listings, setListings] = useState<SellerListing[]>(initialListings);
  const [activeView, setActiveView] = useState<SellView>("listings");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = useMemo(() => ({
    total: listings.length,
    active: listings.filter((l) => l.active).length,
    sold: listings.filter((l) => !l.active).length,
    totalValue: listings.filter((l) => l.active).reduce((sum, l) => sum + l.price, 0),
  }), [listings]);

  const filtered = useMemo(() => {
    let result = [...listings];

    if (statusFilter === "active") result = result.filter((l) => l.active);
    else if (statusFilter === "sold") result = result.filter((l) => !l.active);

    if (categoryFilter !== "all") result = result.filter((l) => l.category === categoryFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.location?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest") result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    else if (sortBy === "oldest") result.sort((a, b) => a.created_at.localeCompare(b.created_at));
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);

    return result;
  }, [listings, statusFilter, categoryFilter, searchQuery, sortBy]);

  const handleToggleActive = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <SellSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onCreateListing={() => setShowCreateModal(true)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        stats={stats}
        displayName={displayName}
        avatarUrl={avatarUrl}
      />

      <SellMain
        view={activeView}
        listings={filtered}
        allListings={listings}
        imageUrls={imageUrls}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleActive={handleToggleActive}
        stats={stats}
        onCreateListing={() => setShowCreateModal(true)}
      />

      <SellRightPanel
        onCreateListing={() => setShowCreateModal(true)}
        displayName={displayName}
        avatarUrl={avatarUrl}
        stats={stats}
      />

      {showCreateModal && (
        <CreateListingModal
          categories={categories}
          onClose={() => setShowCreateModal(false)}
          onCreated={(newListing) => {
            setListings((prev) => [newListing, ...prev]);
            setShowCreateModal(false);
          }}
          userID={userID}
        />
      )}
    </div>
  );
}
