"use client";

import { useState, useMemo } from "react";
import { MinimumListingData, Category, Condition, SortOption, ImageUrls } from "@/lib/types";
import { CATEGORIES } from '@/lib/constants';
import { BuySidebar } from "./BuySidebar";
import { BuyTopBar } from "./BuyTopBar";
import { BuyGrid } from "./BuyGrid";

interface BuyPageShellProps {
	listings: MinimumListingData[];
	imageUrls: ImageUrls;
	savedIds: string[];
}

export function BuyPageShell({ listings, imageUrls, savedIds: initialSavedIds }: BuyPageShellProps) {
	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState<Category>("All");
	const [conditions, setConditions] = useState<Condition[]>([]);
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [sort, setSort] = useState<SortOption>("newest");
	const [savedIds, setSavedIds] = useState<Set<string>>(new Set(initialSavedIds));
	const [showSavedOnly, setShowSavedOnly] = useState(false);

	const toggleSaved = (id: string) => {
		setSavedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const toggleCondition = (c: Condition) => {
		setConditions((prev) =>
			prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
		);
	};

	const filtered = useMemo(() => {
		let result = [...listings];

		if (showSavedOnly) result = result.filter((l) => savedIds.has(l.id));
		if (activeCategory !== "All") result = result.filter((l) => l.category === activeCategory);
		if (query.trim()) {
			const q = query.toLowerCase();
			result = result.filter(
				(l) =>
					l.name.toLowerCase().includes(q) ||
					l.location.toLowerCase().includes(q) ||
					l.description?.toLowerCase().includes(q)
			);
		}
		if (conditions.length > 0) result = result.filter((l) => conditions.includes(l.condition as Condition));
		if (minPrice !== "") result = result.filter((l) => l.price >= Number(minPrice));
		if (maxPrice !== "") result = result.filter((l) => l.price <= Number(maxPrice));

		if (sort === "newest") result.sort((a, b) => b.created_at.localeCompare(a.created_at));
		if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
		if (sort === "price_desc") result.sort((a, b) => b.price - a.price);

		return result;
	}, [listings, query, activeCategory, conditions, minPrice, maxPrice, sort, savedIds, showSavedOnly]);

	const categoryCount = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const cat of CATEGORIES) {
			counts[cat] = cat === "All"
				? listings.length
				: listings.filter((l) => l.category === cat).length;
		}
		return counts;
	}, [listings]);

	return (
		<div className="flex h-full bg-white overflow-hidden">
			<BuySidebar
				activeCategory={activeCategory}
				setActiveCategory={setActiveCategory}
				conditions={conditions}
				toggleCondition={toggleCondition}
				minPrice={minPrice}
				setMinPrice={setMinPrice}
				maxPrice={maxPrice}
				setMaxPrice={setMaxPrice}
				categoryCount={categoryCount}
				savedCount={savedIds.size}
				showSavedOnly={showSavedOnly}
				setShowSavedOnly={setShowSavedOnly}
			/>
			<div className="flex flex-col flex-1 overflow-hidden">
				<BuyTopBar
					query={query}
					setQuery={setQuery}
					sort={sort}
					setSort={setSort}
					resultCount={filtered.length}
				/>
				<BuyGrid
					listings={filtered}
					imageUrls={imageUrls}
					savedIds={savedIds}
					toggleSaved={toggleSaved}
				/>
			</div>
		</div>
	);
}
