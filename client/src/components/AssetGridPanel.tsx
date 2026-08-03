// components/AssetGridPanel.tsx
import { useEffect, useState } from "react";
import { useGetAsset } from "../hooks/useAsset";
import { useDesignStore } from "../stores/useDesignStore";
import { FiX, FiSliders, FiSearch } from "react-icons/fi";
import type { AssetTemplate } from "../types/projectTypes";

export default function AssetGridPanel() {
  const { activeCategory, setActiveCategory } = useDesignStore();
  const { data, isLoading } = useGetAsset();
  const [searchQuery, setSearchQuery] = useState("");

  // Reset search whenever the category changes so old filters don't linger
  useEffect(() => {
    setSearchQuery("");
  }, [activeCategory]);

  if (isLoading) {
  return (
    <div className="w-64 max-w-[90vw] bg-panel/95 backdrop-blur-sm border border-border rounded-2xl px-4 py-6 shadow-md pointer-events-auto flex flex-col items-center justify-center gap-3">
      <div className="relative w-9 h-9">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6B7A58] animate-spin" />
      </div>
      <p className="text-[11px] font-medium text-text-muted tracking-wide">
        Loading assets
      </p>
      <div className="flex gap-1">
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/50 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/50 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/50 animate-bounce" />
      </div>
    </div>
  );
}

  if (!activeCategory) return null;

  if (!data) {
    return (
      <div className="w-64 max-w-[90vw] bg-panel/95 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 shadow-md pointer-events-auto">
        <p className="text-xs text-text-muted">No data</p>
      </div>
    );
  }

  const catalog = (data as unknown as AssetTemplate[]) || [];

  const categoryAssets = catalog.filter(
    (asset) => asset.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const query = searchQuery.trim().toLowerCase();

  const filteredAssets = query
    ? categoryAssets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(query) ||
          asset.subCategory.toLowerCase().includes(query)
      )
    : categoryAssets;

  const subCategories = Array.from(
    new Set(filteredAssets.map((a) => a.subCategory))
  );

  return (
    <div className="w-64 max-w-[90vw] max-h-[70vh] bg-panel/95 backdrop-blur-sm border border-border rounded-2xl p-3 shadow-md flex flex-col gap-3 animate-fade-in pointer-events-auto">
      {/* Category header */}
      <div className="flex items-center justify-between border-b border-border pb-2 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
          {activeCategory}
        </h3>
        <button
          onClick={() => setActiveCategory(null)}
          className="text-text-muted hover:text-text-main transition-colors p-1 rounded-md hover:bg-border/40 cursor-pointer"
          aria-label="Close asset panel"
        >
          <FiX size={14} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center gap-1.5 bg-bg border border-border rounded-xl px-3 py-1.5 shrink-0 transition-colors focus-within:border-[#6B7A58]/60 focus-within:ring-1 focus-within:ring-[#6B7A58]/30">
        <FiSearch size={12} className="text-text-muted shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeCategory}...`}
          className="bg-transparent text-xs text-text-main outline-none w-full placeholder:text-text-muted"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-text-muted hover:text-text-main transition-colors shrink-0 cursor-pointer"
            aria-label="Clear search"
          >
            <FiX size={12} />
          </button>
        )}
      </div>

      {/* Subcategories */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-3.5">
        {filteredAssets.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-6">
            No results for “{searchQuery}”
          </p>
        ) : (
          subCategories.map((subCat) => (
            <div key={subCat} className="flex flex-col gap-2">
              <span className="text-[9px] font-bold text-text-muted tracking-[0.12em] uppercase">
                {subCat}
              </span>

              <div className="grid grid-cols-2 gap-2">
                {filteredAssets
                  .filter((asset) => asset.subCategory === subCat)
                  .map((asset) => (
                    <button
                      key={asset.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", asset.id);
                      }}
                      className="aspect-square flex flex-col items-center justify-center p-2 rounded-xl border border-border bg-bg hover:bg-border/30 hover:border-[#6B7A58]/50 transition-all group relative cursor-grab active:cursor-grabbing"
                    >
                      {/* Show image preview */}
                      <img
                        src={asset.imagePath}
                        alt={asset.name}
                        className="w-11 h-11 object-contain mb-1 transition-transform duration-150 group-hover:scale-110"
                        loading="lazy"
                      />
                      <span className="text-[10px] font-medium text-text-muted text-center leading-tight pointer-events-none truncate w-full group-hover:text-text-main">
                        {asset.name}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}