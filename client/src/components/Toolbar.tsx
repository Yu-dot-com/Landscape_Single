import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  FiCloudLightning,
  FiShare2,
  FiDownload,
  FiSave,
  FiCheck,
} from "react-icons/fi";
import { BiRedo, BiUndo } from "react-icons/bi";
import { useDesignStore } from "../stores/useDesignStore";
import { useSaveCanvas } from "../hooks/useCanvas";
import SharePanel from "./Panel/sharePanel";

// Deep equality utility function to safely compare arrays of objects
const areCanvasItemsEqual = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length) return false;
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

export default function Toolbar() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const { mutate, isError } = useSaveCanvas();
  const { placedItems, lastSavedPlacedItems, setLastSavedPlacedItems } =
    useDesignStore();

  const [ showSharePanel, setShowSharePanel ] = useState<boolean>(false);

  // Compare active canvas state with our baseline snapshot
  const hasUnsavedChanges = useMemo(() => {
    return !areCanvasItemsEqual(placedItems, lastSavedPlacedItems);
  }, [placedItems, lastSavedPlacedItems]);

  const handleSave = async () => {
    if (!projectId || !hasUnsavedChanges || isSaving) return;

    try {
      setIsSaving(true);

      // Map frontend model exactly to Postgres columns
      const payload = placedItems.map((item) => ({
        id: item.id,
        project_id: projectId,
        asset_id: item.asset_id,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        rotation: item.rotation,
        z_index: item.z_index,
        points: item.points ? JSON.stringify(item.points) : null,
        color: item.color || null,
      }));

      mutate({ projectId, placedItems: payload });

      if (isError) throw new Error("Failed to save changes");

      // Update the snapshot to lock the save button until the next mutation
      setLastSavedPlacedItems(placedItems);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="w-full h-16 border-b border-border bg-bg px-6 flex items-center justify-between z-20">
      {/* Left: Brand Identity & Active Filename */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-text-main">
            My Project
          </span>
        </div>

        {/* Undo/Redo & Interactive Save Status */}
        <div className="flex items-center space-x-3 text-text-muted ml-4">
          <button className="hover:text-text-main transition-colors">
            <BiUndo size={16} />
          </button>
          <button className="hover:text-text-main transition-colors">
            <BiRedo size={16} />
          </button>

          <div className="h-4 w-px bg-border" />

          {/* New Interactive Save Action */}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
              hasUnsavedChanges
                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer"
                : "text-emerald-600 bg-emerald-50/50 border border-emerald-100 cursor-default"
            }`}
          >
            {isSaving ? (
              <>
                <FiCloudLightning
                  size={14}
                  className="animate-pulse text-amber-500"
                />
                <span>Saving changes...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <FiSave size={14} className="text-amber-500" />
                <span>Unsaved changes (Save)</span>
              </>
            ) : (
              <>
                <FiCheck size={14} className="text-emerald-500" />
                <span>Saved</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right: Real-time Multi-user Avatars & Actions */}
      <div className="flex items-center space-x-4">
        {/* Collaborative Presences */}
        <div className="flex items-center -space-x-2 mr-2">
          <img
            className="w-7 h-7 rounded-full border-2 border-bg object-cover"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
            alt="User"
          />
          <img
            className="w-7 h-7 rounded-full border-2 border-bg object-cover"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
            alt="User"
          />
          <img
            className="w-7 h-7 rounded-full border-2 border-bg object-cover"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
            alt="User"
          />
          <div className="w-7 h-7 rounded-full bg-border text-[10px] font-bold text-text-main flex items-center justify-center border-2 border-bg">
            +2
          </div>
        </div>

        {/* Share and Export Controls */}
        <button
          onClick={() => setShowSharePanel((prev) => !prev)}
          className="h-9 px-4 rounded-xl bg-[#6B7A58] hover:bg-[#576446] text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-colors cursor-pointer"
        >
          <FiShare2 size={14} />
          <span>share</span>
        </button>

        <button className="h-9 px-4 rounded-xl border border-border bg-white text-text-main text-xs font-bold flex items-center space-x-2 hover:bg-panel transition-colors cursor-pointer">
          <FiDownload size={14} />
          <span>export</span>
        </button>

        {/* User Account Menu Entry Button */}
        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 text-xs font-bold text-darkAccent flex items-center justify-center cursor-pointer">
          M
        </div>
      </div>
      {showSharePanel && (
        <SharePanel onClose={() => setShowSharePanel(false)} />
      )}
    </header>
  );
}
