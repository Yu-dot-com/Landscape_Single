import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiCloudLightning,
  FiShare2,
  FiDownload,
  FiSave,
  FiChevronDown,
  FiActivity
} from "react-icons/fi";
import { RiLeafLine } from "react-icons/ri";

import { useSaveCanvas } from "../hooks/useCanvas";
import { getItemsMap } from "../collaboration/yjs";
import type { PlacedItem } from "../types/projectTypes";
import SharePanel from "./Panel/sharePanel";
import PresencePanel from "./Panel/presencePanel";
import { exportCanvasAsPNG, generateCanvasThumbnail } from "../utils/exportCanvas";
import { useUpdateProjectThumbnail } from "../hooks/useProject";
import ActivityPanel from "./Panel/ActivityPanel";

export default function Toolbar() {
  const { projectId } = useParams<{ projectId: string }>();

  const { mutateAsync: saveCanvas } = useSaveCanvas();
  const { mutateAsync: updateThumbnail } = useUpdateProjectThumbnail();
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!projectId || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      // Get the latest state directly from Yjs
      const currentItems = Array.from(
        getItemsMap().values()
      ) as PlacedItem[];

      const payload = currentItems.map((item) => ({
        id: item.id,
        project_id: projectId,
        asset_id: item.asset_id,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        rotation: item.rotation,
        z_index: item.z_index,
        points: item.points
          ? JSON.stringify(item.points)
          : null,
        color: item.color ?? null,
      }));

      await saveCanvas({
        projectId,
        placedItems: payload,
      });
      const thumbnailBase64 = generateCanvasThumbnail();

      await updateThumbnail({
        projectId,
        thumbnail: thumbnailBase64,
      });

      console.log("Canvas saved successfully");

    } catch (error) {
      console.error("Failed to save canvas:", error);

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="relative w-full h-16 border-b border-border bg-bg px-4 sm:px-6 grid grid-cols-[1fr_auto_1fr] items-center z-20">
      {/* LEFT: brand / project context / undo-redo */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-[#6B7A58]/15 flex items-center justify-center shrink-0">
          <RiLeafLine size={14} className="text-[#6B7A58]" />
        </div>

        <div className="h-4 w-px bg-border shrink-0" />

        <div className="relative flex items-center gap-1 min-w-0">
          <span className="text-sm font-semibold text-text-main truncate">
            My Project
          </span>
          <FiChevronDown size={13} className="text-text-muted shrink-0" />
          <select
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Project options"
          />
        </div>

        <div className="h-4 w-px bg-border shrink-0" />
      </div>

  
      <div className="flex items-center">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer disabled:cursor-not-allowed
            ${
              isSaving
                ? "bg-[#6B7A58]/10 border-[#6B7A58]/30 text-[#6B7A58]/80"
                : "bg-[#6B7A58] border-[#6B7A58] text-white hover:bg-[#576446] active:scale-95"
            }
          `}
        >
          {isSaving ? (
            <>
              <FiCloudLightning size={14} className="animate-pulse" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FiSave size={14} />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      {/* RIGHT: presence / share / export / avatar */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0">
        <PresencePanel />

        <div className="h-4 w-px bg-border shrink-0" />

        <button
          onClick={() => setShowSharePanel((prev) => !prev)}
          aria-label="Share project"
          className="h-9 px-3 sm:px-4 rounded-lg bg-[#6B7A58] hover:bg-[#576446] text-white text-xs font-semibold flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <FiShare2 size={14} />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          onClick={exportCanvasAsPNG}
          aria-label="Export as PNG"
          className="h-9 px-3 sm:px-4 rounded-lg border border-border bg-bg text-text-main text-xs font-semibold flex items-center gap-2 hover:bg-panel active:scale-95 transition-all cursor-pointer"
        >
          <FiDownload size={14} />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={() => setShowActivityPanel(true)}
          className="h-9 px-3 sm:px-4 rounded-lg border border-border bg-bg text-text-main text-xs font-semibold flex items-center gap-2 hover:bg-panel transition-all active:scale-95"
        >
          <FiActivity size={14} />
          <span className="hidden sm:inline">Activity</span>
        </button>

        <button
          aria-label="Account"
          className="w-8 h-8 rounded-full bg-[#6B7A58]/15 border border-[#6B7A58]/30 text-xs font-bold text-[#6B7A58] flex items-center justify-center hover:bg-[#6B7A58]/25 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          M
        </button>
      </div>

      {showSharePanel && (
        <SharePanel onClose={() => setShowSharePanel(false)} />
      )}
      {showActivityPanel && (
        <ActivityPanel onClose={() => setShowActivityPanel(false)} />
      )}
    </header>
  );
}