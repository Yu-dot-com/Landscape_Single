// components/AssetGridPanel.tsx
import { useGetAsset } from "../hooks/useAsset";
import { useDesignStore } from "../stores/useDesignStore";
import { FiX, FiSliders } from "react-icons/fi";
import type { AssetTemplate } from "../types/assetTypes";

export default function AssetGridPanel() {
  const { activeCategory, setActiveCategory } = useDesignStore();
  const { data, isLoading } = useGetAsset();
  if (isLoading) {
    return <p>loading asset</p>;
  }
const catalog = (data as unknown as AssetTemplate[]) || [];
  if (!activeCategory) return null;

const filteredAssets = catalog.filter(
    (asset) => asset.category.toLowerCase() === activeCategory.toLowerCase()
  );
  const subCategories = Array.from(
    new Set(filteredAssets.map((a) => a.subCategory))
  );

  return (
    <div className="w-64 h-auto bg-bg max-h-130 bg-panel border border-border rounded-2xl p-3 shadow-sm flex flex-col gap-4 animate-fade-in pointer-events-auto">
      {/* Category header */}
      <div className="flex items-center justify-between border-b border-brand-muted/10 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {activeCategory}
        </h3>
        <button
          onClick={() => setActiveCategory(null)}
          className="text-text-muted hover:text-text-main transition p-1 rounded-md"
        >
          <FiX size={14} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center bg-bg-main/50 border border-brand-muted/20 rounded-xl px-3 py-1.5">
        <input
          type="text"
          placeholder={`Search ${activeCategory}...`}
          className="bg-transparent text-xs text-text-main outline-none w-full placeholder:text-text-muted/50"
          disabled
        />
        <FiSliders size={12} className="text-text-muted/60" />
      </div>

      {/* Subcategories */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
        {subCategories.map((subCat) => (
          <div key={subCat} className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-text-muted/60 tracking-wider uppercase">
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
                    className="aspect-square flex flex-col items-center justify-center p-2 rounded-xl border transition group relative bg-bg-main/40 border-brand-muted/10 hover:border-brand-muted/30 hover:bg-bg-main/70"
                  >
                    {/* Show image preview */}
                    <img
                      src={asset.imagePath}
                      alt={asset.name}
                      className="w-12 h-12 object-contain mb-1 group-hover:scale-110 transition"
                      loading="lazy"
                    />
                    <span className="text-[10px] font-medium text-text-muted text-center leading-tight pointer-events-none truncate w-full group-hover:text-text-main">
                      {asset.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
