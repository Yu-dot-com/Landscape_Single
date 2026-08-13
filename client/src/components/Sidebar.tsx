import { FiUploadCloud, FiLayers } from "react-icons/fi";
import { RiLayoutLine, RiLeafLine } from "react-icons/ri";
import { MdOutlineChair } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";

import { useDesignStore } from "../stores/useDesignStore";

import RoomPanel from "./Panel/roomPanel";
import WallPanel from "./Panel/wallPanel";
import FurniturePanel from "./Panel/furniturePanel";
import PlantPanel from "./Panel/plantPanel";
import UploadPanel from "./Panel/uploadPanel";
import MaterialPanel from "./Panel/materialPanel";

export default function Sidebar() {
  const { activeCategory, setActiveCategory } = useDesignStore();

  const tools = [
    { icon: <FiLayers size={17} />, label: "rooms", id: "rooms" },
    { icon: <RiLayoutLine size={17} />, label: "walls", id: "walls" },
    { icon: <MdOutlineChair size={17} />, label: "furniture", id: "furniture" },
    { icon: <RiLeafLine size={17} />, label: "plants", id: "plants" },
    { icon: <BiCategoryAlt size={17} />, label: "materials", id: "materials" },
    { icon: <FiUploadCloud size={17} />, label: "upload", id: "upload" },
  ];

  const handleToolClick = (id: string) => {
    // clicking same button closes panel
    if (activeCategory === id) {
      setActiveCategory(null);
      return;
    }

    setActiveCategory(id);
  };

  const renderPanel = () => {
    switch (activeCategory) {
      case "rooms":
        return <RoomPanel />;

      case "walls":
        return <WallPanel />;

      case "furniture":
        return <FurniturePanel />;

      case "plants":
        return <PlantPanel />;

      case "upload":
        return <UploadPanel />;

      case "materials":
        return <MaterialPanel />;

      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4 items-start pointer-events-none">
      {/* LEFT TOOLBAR */}
      <aside className="w-20 shrink-0 pointer-events-auto select-none">
        <div className="w-full bg-panel/95 backdrop-blur-sm border border-border rounded-2xl p-2.5 shadow-md flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted/70 px-1.5 mb-2">
            Tools
          </span>

          <div className="flex flex-col gap-1">
            {tools.map((tool) => {
              const active = activeCategory === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  aria-pressed={active}
                  className={`
                    group relative w-full h-14 flex flex-col items-center justify-center gap-1
                    rounded-xl text-[10px] font-semibold capitalize overflow-hidden
                    transition-all duration-150 ease-out active:scale-95 cursor-pointer
                    ${
                      active
                        ? "bg-[#6B7A58] text-white shadow-sm"
                        : "text-text-main hover:bg-border/40"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-0.75 rounded-full bg-white/80" />
                  )}
                  <span
                    className={`transition-transform duration-150 ${
                      active ? "scale-105" : "group-hover:scale-105"
                    }`}
                  >
                    {tool.icon}
                  </span>
                  <span className="leading-none">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="pointer-events-auto">{renderPanel()}</div>
    </div>
  );
}