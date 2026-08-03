import { Outlet, useParams } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import Sidebar from "../components/Sidebar";
import ItemControlPanel from "../components/itemControlPanel";
import { useDesignStore } from "../stores/useDesignStore";
import { useGetCanvas } from "../hooks/useCanvas";
import { useEffect } from "react";
import { loadItemsToYjs } from "../collaboration/CanvasSynce";
import ToastContainer from "../components/ToastContainer";

export default function EditorLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const { activePlacedItemId } = useDesignStore();
  const { data: savedItems, isLoading } = useGetCanvas(projectId || "");
  useEffect(() => {
    if (!savedItems || !projectId) {
      return;
    }
    loadItemsToYjs(savedItems as any);
  }, [savedItems, projectId]);
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg">
        <div className="relative w-11 h-11 mb-5">
          <div className="absolute inset-0 rounded-full border-[3px] border-border" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#6B7A58] animate-spin" />
        </div>

        <p className="text-sm font-medium text-text-main tracking-wide">
          Loading spatial workspace
        </p>

        <div className="flex gap-1.5 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/50 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/50 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/50 animate-bounce" />
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen w-screen flex flex-col bg-bg text-text-main overflow-hidden">
      <ToastContainer />
      {/* Top Navbar */}
      <Toolbar />

      <div className="flex-1 relative flex overflow-hidden">
        <div className="absolute left-6 top-6 bottom-6 z-10 pointer-events-none">
          <div className="pointer-events-auto h-full">
            <Sidebar />
          </div>
        </div>

        <div className="w-full h-full z-0 bg-canvas-grid">
          <Outlet />
        </div>

        {activePlacedItemId && (
          <div className="absolute right-6 top-6 bottom-6 z-10 pointer-events-none">
            <div className="pointer-events-auto h-full">
              <ItemControlPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
