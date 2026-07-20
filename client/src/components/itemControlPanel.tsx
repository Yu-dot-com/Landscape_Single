import { useState } from "react";
import { useDesignStore } from "../stores/useDesignStore";
import { useGetAsset } from "../hooks/useAsset";
import type { AssetTemplate } from "../types/assetTypes";

export default function ItemControlPanel() {
  const {
    placedItems,
    updateItemPosition,
    updateItemScale,
    updateItemRotation,
    updateItemColor, // Added to allow wall color customization
    bringToFront,
    bringToBack,
    setActivePlacedItemId,
    activePlacedItemId,
    addItemToCanvasById,
    deleteItem,
  } = useDesignStore();

  const item = placedItems.find((item) => item.id === activePlacedItemId);
  const { data, isLoading } = useGetAsset();
  if (isLoading) {
    return <p>loading asset</p>;
  }
  const catalog = (data as unknown as AssetTemplate[]) || [];
  const template = item
    ? catalog.find((t) => t.id === item.asset_id)
    : undefined;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!item || !template) return null;

  const isWall = item.category === "walls";

  const minW = template.minWidth ?? 15;
  const maxW = template.maxWidth ?? 800;
  const minH = template.minHeight ?? 15;
  const maxH = template.maxHeight ?? 800;

  const sortedByZ = [...placedItems].sort(
    (a, b) => (a.z_index ?? 0) - (b.z_index ?? 0),
  );
  const currentZOrder = sortedByZ.findIndex((i) => i.id === item.id) + 1;

  const handlePositionChange = (field: "x" | "y", value: string) => {
    const num = parseFloat(value) || 0;
    if (field === "x") updateItemPosition(item.id, num, item.y);
    if (field === "y") updateItemPosition(item.id, item.x, num);
  };

  const handleRotationChange = (value: string) => {
    const num = parseFloat(value) || 0;
    // Normalize rotation to 0-360
    const normalized = ((num % 360) + 360) % 360;
    updateItemRotation(item.id, normalized);
  };

  const handleScaleChange = (field: "w" | "h", value: string) => {
    const num = parseFloat(value) || 0;
    if (field === "w") {
      updateItemScale(item.id, num, item.height);
    }
    if (field === "h") {
      updateItemScale(item.id, item.width, num);
    }
  };

  const handleDuplicate = () => {
    addItemToCanvasById(
      template,
      item.x + 20,
      item.y + 20,
      item.width,
      item.height,
      item.rotation,
    );
  };

  return (
    <div className="w-full max-w-sm sm:max-w-70 md:max-w-xs bg-[#faf9f6]/95 backdrop-blur-sm rounded-xl px-3.5 py-3 border border-gray-100 shadow-lg font-sans text-gray-700 select-none pointer-events-auto transition-all">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
          Properties
        </h2>
        <button
          onClick={() => setActivePlacedItemId(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 hover:bg-gray-100 rounded"
          aria-label="Close panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* ITEM INFO */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-15 h-10 rounded-lg border border-gray-100 flex items-center justify-center p-1 overflow-hidden shadow-sm shrink-0 bg-white">
          {isWall ? (
            // Dynamic color fallback for vector assets
            <div
              className="w-full h-full rounded"
              style={{ backgroundColor: item.color || "#64748b" }}
            />
          ) : (
            <img
              src={template.imagePath}
              alt={item.name}
              className="object-contain w-full h-full"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-[10px] text-gray-400 truncate uppercase tracking-wide">
            {template.subCategory}
          </p>
        </div>
      </div>

      <hr className="border-gray-200/50 my-1.5" />

      {/* POSITION SECTION (Works for both Trees and Walls) */}
      <div className="mb-3">
        <h4 className="text-[10px] font-bold tracking-wide uppercase text-gray-500 mb-2">
          Position
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-center justify-center">
            <label className="text-[13px] text-gray-400 font-medium">X</label>
            <div className="flex items-center bg-white rounded-md px-2 py-1.5 border border-gray-100 shadow-sm focus-within:ring-1 focus-within:ring-amber-400 focus-within:border-amber-300 transition-colors">
              <input
                type="number"
                value={Math.round(item.x)}
                onChange={(e) => handlePositionChange("x", e.target.value)}
                className="w-full text-right text-xs font-semibold focus:outline-none bg-transparent text-gray-800"
                step="1"
              />
              <span className="text-[10px] text-gray-400 ml-1">px</span>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <label className="text-[13px] text-gray-400 font-medium">Y</label>
            <div className="flex items-center bg-white rounded-md px-2 py-1.5 border border-gray-100 shadow-sm focus-within:ring-1 focus-within:ring-amber-400 focus-within:border-amber-300 transition-colors">
              <input
                type="number"
                value={Math.round(item.y)}
                onChange={(e) => handlePositionChange("y", e.target.value)}
                className="w-full text-right text-xs font-semibold focus:outline-none bg-transparent text-gray-800"
                step="1"
              />
              <span className="text-[10px] text-gray-400 ml-1">px</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROTATION SECTION (Works for both Trees and Walls) */}
      <div className="mb-3">
        <h4 className="text-[10px] font-bold tracking-wide uppercase text-gray-500 mb-1">
          Rotation
        </h4>
        <div className="flex items-center bg-white rounded-md px-2 py-1.5 border border-gray-100 shadow-sm focus-within:ring-1 focus-within:ring-amber-400 focus-within:border-amber-300 transition-colors">
          <input
            type="number"
            value={Math.round(item.rotation)}
            onChange={(e) => handleRotationChange(e.target.value)}
            className="flex-1 text-right text-xs font-semibold focus:outline-none bg-transparent text-gray-800"
            step="1"
            min="0"
            max="360"
          />
          <span className="text-[10px] text-gray-400 ml-1">°</span>
        </div>
      </div>

      <hr className="border-gray-200/50 my-2.5" />

      {/* CONDITIONAL SECTION: Walls (Color Picker) vs Standard Items (Dimensions) */}
      {isWall ? (
        <div className="mb-3">
          <h4 className="text-[10px] font-bold tracking-wide uppercase text-gray-500 mb-2">
            Construction
          </h4>
          <div className="flex items-center justify-between bg-white rounded-md px-3 py-1.5 border border-gray-100 shadow-sm focus-within:ring-1 focus-within:ring-blue-400 transition-colors">
            <span className="text-xs font-medium text-gray-500">
              Wall Color
            </span>
            <input
              type="color"
              value={item.color || "#64748b"}
              onChange={(e) => updateItemColor?.(item.id, e.target.value)}
              className="w-10 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
            />
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <h4 className="text-[10px] font-bold tracking-wide uppercase text-gray-500 mb-2">
            Dimensions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex gap-2 items-center justify-center">
              <label className="text-[10px] text-gray-400 font-medium">
                Width
              </label>
              <div className="flex items-center bg-white rounded-md px-2 py-1.5 border border-gray-100 shadow-sm focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-blue-300 transition-colors">
                <input
                  type="number"
                  value={Math.round(item.width)}
                  onChange={(e) => handleScaleChange("w", e.target.value)}
                  className="w-full text-right text-xs font-semibold focus:outline-none bg-transparent text-gray-800"
                  step="1"
                  min={minW}
                  max={maxW}
                />
                <span className="text-[10px] text-gray-400 ml-1">px</span>
              </div>
              <p className="text-[9px] text-gray-300">
                {minW}–{maxW}
              </p>
            </div>
            <div className="flex gap-1 items-center justify-center">
              <label className="text-[10px] text-gray-400 font-medium">
                Height
              </label>
              <div className="flex items-center bg-white rounded-md px-2 py-1.5 border border-gray-100 shadow-sm focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-blue-300 transition-colors">
                <input
                  type="number"
                  value={Math.round(item.height)}
                  onChange={(e) => handleScaleChange("h", e.target.value)}
                  className="w-full text-right text-xs font-semibold focus:outline-none bg-transparent text-gray-800"
                  step="1"
                  min={minH}
                  max={maxH}
                />
                <span className="text-[10px] text-gray-400 ml-1">px</span>
              </div>
              <p className="text-[9px] text-gray-300">
                {minH}–{maxH}
              </p>
            </div>
          </div>
        </div>
      )}

      <hr className="border-gray-200/50 my-2.5" />

      {/* LAYER / Z-ORDER (Works for both Trees and Walls) */}
      <div className="mb-3">
        <h4 className="text-[10px] font-bold tracking-wide uppercase text-gray-500 mb-2">
          Layer
        </h4>
        <div className="flex items-center justify-between bg-gray-50 rounded-md px-2.5 py-2 border border-gray-100 mb-2.5">
          <span className="text-xs text-gray-600">Position in stack</span>
          <span className="text-xs font-bold text-gray-800">
            {currentZOrder} of {placedItems.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => bringToFront?.(item.id)}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-semibold shadow-sm hover:bg-amber-700 active:scale-95 transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 3h8v8H3V3zm10-2v12h12V1h-12zm0 14H1v8h12v-8z" />
            </svg>
            Front
          </button>
          <button
            onClick={() => bringToBack?.(item.id)}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-gray-400 text-white rounded-lg text-[11px] font-semibold shadow-sm hover:bg-gray-500 active:scale-95 transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 13H1v8h12v-8zm8-12v12h2V1h-2zM3 1h8v2H3V1zm0 4h8v2H3V5z" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <hr className="border-gray-200/50 my-2.5" />

      {/* ACTIONS SECTION */}
      <div>
        <h4 className="text-[10px] font-bold tracking-wide uppercase text-gray-500 mb-2">
          Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDuplicate}
            className="flex items-center justify-center gap-1 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all cursor-pointer"
            aria-label="Duplicate item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="3" width="8" height="8" />
              <rect x="13" y="13" width="8" height="8" />
              <path d="M11 3h10v10M3 13v8h8" />
            </svg>
            Duplicate
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-1 py-1.5 bg-white border border-red-200 rounded-lg text-[11px] font-semibold text-red-600 shadow-sm hover:bg-red-50/50 hover:border-red-300 active:scale-95 transition-all cursor-pointer"
            aria-label="Delete item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6h16zM10 11v6M14 11v6" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs">
            <h3 className="font-semibold text-gray-800 mb-2">Delete item?</h3>
            <p className="text-sm text-gray-600 mb-4">This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteItem?.(item.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
