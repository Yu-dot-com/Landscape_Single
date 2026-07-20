import { Outlet, useParams } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import Sidebar from "../components/Sidebar";
import ItemControlPanel from "../components/itemControlPanel";
import { useDesignStore } from "../stores/useDesignStore";
import { useGetCanvas } from "../hooks/useCanvas";
import { useEffect } from "react";
import ToastContainer from "../components/ToastContainer";

export default function EditorLayout() {
  const { activePlacedItemId,setPlacedItems } = useDesignStore();
  const { projectId } = useParams<{ projectId: string }>();

  const { data: savedItems, isLoading } = useGetCanvas(projectId);
  useEffect(() => {
    if (savedItems) {
      setPlacedItems(savedItems as any);
    }
  }, [savedItems, setPlacedItems]);
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg text-text-muted text-sm font-medium">
        Loading spatial workspace...
      </div>
    );
  }
  if (isLoading) {
    return <p>Loading canvas...</p>;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-bg text-text-main overflow-hidden">
      {/* Top Navbar */}
      <Toolbar />

      {/* Main Workspace Area */}
      <div className="flex-1 relative flex overflow-hidden">
        <div className="absolute left-6 top-6 bottom-6 z-10 pointer-events-none">
          <div className="pointer-events-auto h-full">
            <Sidebar />
          </div>
        </div>
        <ToastContainer />

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
