import { useState } from "react";
import { FiX, FiCopy, FiTrash2 } from "react-icons/fi";
import { useDesignStore } from "../stores/useDesignStore";
import { useGetAsset } from "../hooks/useAsset";
import type { AssetTemplate } from "../types/projectTypes";
import { useCanvasItems } from "../collaboration/CanvasSynce";

function NumberField({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  suffix: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="flex items-center gap-1.5 bg-bg border border-border rounded-lg px-2.5 py-1.5 transition-colors focus-within:border-[#6B7A58]/60 focus-within:ring-1 focus-within:ring-[#6B7A58]/30">
      <span className="text-[10px] font-semibold text-text-muted w-3 shrink-0">
        {label}
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        max={max}
        className="flex-1 min-w-0 text-right text-xs font-medium text-text-main bg-transparent outline-none"
      />
      <span className="text-[10px] text-text-muted/70 shrink-0">{suffix}</span>
    </label>
  );
}

export default function ItemControlPanel() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    updateItemPosition,
    updateItemRotation,
    bringToFront,
    bringToBack,
    setActivePlacedItemId,
    activePlacedItemId,
    addItemToCanvasById,
    deleteItem,
  } = useDesignStore();
  const { data, isLoading } = useGetAsset();
  const placedItems = useCanvasItems();

if (isLoading) {
  return (
    <div className="w-72 max-w-[90vw] bg-panel/95 backdrop-blur-sm border border-border rounded-2xl px-4 py-6 shadow-lg pointer-events-auto flex flex-col items-center justify-center gap-3">
      <div className="relative w-9 h-9">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6B7A58] animate-spin" />
      </div>
      <p className="text-[11px] font-medium text-text-muted tracking-wide">
        Loading properties
      </p>
      <div className="flex gap-1">
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/50 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/50 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/50 animate-bounce" />
      </div>
    </div>
  );
}

  const catalog = (data as unknown as AssetTemplate[]) || [];
  const item = placedItems.find((item) => item.id === activePlacedItemId);
  const template = item
    ? catalog.find((t) => t.id === item.asset_id)
    : undefined;

  if (!item || !template) return null;

  const isWall = item.category === "walls";

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

  const handleDuplicate = () => {
    const newId = addItemToCanvasById(
      template,
      item.x + 24,
      item.y + 24,
      item.width,
      item.height,
      item.rotation,
    );

    // Select the new duplicate so repeated clicks stagger
    // instead of always branching off the original at +24,+24
    if (newId) setActivePlacedItemId(newId);
  };

  return (
    <div className="w-72 max-w-[90vw] bg-panel/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 border border-border shadow-lg font-sans text-text-main select-none pointer-events-auto transition-all">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[10px] font-bold tracking-[0.14em] uppercase text-text-muted">
          Properties
        </h2>
        <button
          onClick={() => setActivePlacedItemId(null)}
          className="text-text-muted hover:text-text-main transition-colors cursor-pointer p-1 rounded-md hover:bg-border/40"
          aria-label="Close panel"
        >
          <FiX size={15} />
        </button>
      </div>

      {/* ITEM INFO */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-14 h-11 rounded-lg border border-border flex items-center justify-center p-1 overflow-hidden shrink-0 bg-bg">
          {isWall ? (
            <div
              className="w-full h-full rounded"
              style={{ backgroundColor: "#64748b" }}
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
          <h3 className="font-semibold text-text-main text-sm leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-[10px] text-text-muted truncate uppercase tracking-wide">
            {template.subCategory}
          </p>
        </div>
      </div>

      <div className="h-px bg-border my-2.5" />

      {/* POSITION SECTION (Works for both Trees and Walls) */}
      <div className="mb-3">
        <h4 className="text-[10px] font-bold tracking-wide uppercase text-text-muted mb-1.5">
          Position
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="X"
            value={Math.round(item.x)}
            onChange={(v) => handlePositionChange("x", v)}
            suffix="px"
          />
          <NumberField
            label="Y"
            value={Math.round(item.y)}
            onChange={(v) => handlePositionChange("y", v)}
            suffix="px"
          />
        </div>
      </div>

      {/* ROTATION SECTION (Works for both Trees and Walls) */}
      <div className="mb-3">
        <h4 className="text-[10px] font-bold tracking-wide uppercase text-text-muted mb-1.5">
          Rotation
        </h4>
        <NumberField
          label="R"
          value={Math.round(item.rotation)}
          onChange={handleRotationChange}
          suffix="°"
          min={0}
          max={360}
        />
      </div>

      <div className="h-px bg-border my-2.5" />

      {/* LAYER / Z-ORDER (Works for both Trees and Walls) */}
      <div className="mb-3">
        <h4 className="text-[10px] font-bold tracking-wide uppercase text-text-muted mb-1.5">
          Layer
        </h4>
        <div className="flex items-center justify-between bg-bg rounded-lg px-2.5 py-2 border border-border mb-2">
          <span className="text-xs text-text-muted">Position in stack</span>
          <span className="text-xs font-semibold text-text-main">
            {currentZOrder} of {placedItems.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => bringToFront?.(item.id)}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-border/40 text-text-main rounded-lg text-[11px] font-semibold hover:bg-border/70 active:scale-95 transition-all cursor-pointer"
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
            className="flex items-center justify-center gap-1.5 py-1.5 bg-border/40 text-text-main rounded-lg text-[11px] font-semibold hover:bg-border/70 active:scale-95 transition-all cursor-pointer"
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

      <div className="h-px bg-border my-2.5" />

      {/* ACTIONS SECTION */}
      <div>
        <h4 className="text-[10px] font-bold tracking-wide uppercase text-text-muted mb-1.5">
          Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDuplicate}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-bg border border-border rounded-lg text-[11px] font-semibold text-text-main hover:bg-border/30 active:scale-95 transition-all cursor-pointer"
            aria-label="Duplicate item"
          >
            <FiCopy size={13} />
            Duplicate
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-1.5 py-1.5 bg-bg border border-red-200 rounded-lg text-[11px] font-semibold text-red-600 hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Delete item"
          >
            <FiTrash2 size={13} />
            Delete
          </button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL — restyled to match app UI */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 pointer-events-auto rounded-2xl">
          <div className="w-72 max-w-[90vw] bg-white backdrop-blur-sm border border-border rounded-2xl px-4 py-3.5 shadow-lg font-sans">
            <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-text-muted mb-2">
              Delete item
            </h3>
            <p className="text-sm text-text-main mb-1">
              Delete <span className="font-semibold">{item.name}</span>?
            </p>
            <p className="text-xs text-text-muted mb-4">
              This cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex items-center justify-center py-1.5 bg-border/40 text-text-main rounded-lg text-[11px] font-semibold hover:bg-border/70 active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteItem?.(item.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 bg-red-600 text-white rounded-lg text-[11px] font-semibold hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
              >
                <FiTrash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}