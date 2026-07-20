import { FiMousePointer, FiUploadCloud, FiLayers } from "react-icons/fi";
import { RiLayoutLine, RiLeafLine } from "react-icons/ri";
import { MdOutlineChair } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { useDesignStore } from "../stores/useDesignStore";

import RoomPanel from "./Panel/roomPanel";
import WallPanel from "./Panel/wallPanel";
import FurniturePanel from "./Panel/furniturePanel";
import PlantPanel from "./Panel/plantPanel";
import UploadPanel from "./Panel/uploadPanel";
import SelectPanel from "./Panel/selectPanel";
import MaterialsPanel from "./Panel/materialPanel";

export default function Sidebar() {
  const { activeCategory, setActiveCategory } = useDesignStore();

  const tools = [
    {
      icon: <FiMousePointer size={16} />,
      label: "select",
      id: "select",
    },
    {
      icon: <FiLayers size={16} />,
      label: "rooms",
      id: "rooms",
    },
    {
      icon: <RiLayoutLine size={16} />,
      label: "walls",
      id: "walls",
    },
    {
      icon: <MdOutlineChair size={16} />,
      label: "furniture",
      id: "furniture",
    },
    {
      icon: <RiLeafLine size={16} />,
      label: "plants",
      id: "plants",
    },
    {
      icon: <BiCategoryAlt size={16} />,
      label: "materials",
      id: "materials",
    },
    {
      icon: <FiUploadCloud size={16} />,
      label: "upload",
      id: "upload",
    },
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
      case "select":
        return <SelectPanel />;

      case "rooms":
        return <RoomPanel />;

      case "walls":
        return <WallPanel />;

      case "furniture":
        return <FurniturePanel />;

      case "plants":
        return <PlantPanel />;

      case "materials":
        return <MaterialsPanel />;

      case "upload":
        return <UploadPanel />;

      default:
        return null;
    }
  };

  return (
    <div
      className="
      flex 
      gap-4 
      items-start
      pointer-events-none
    "
    >
      {/* LEFT TOOLBAR */}
      <aside
        className="
          w-20
          bg-bg
          pointer-events-auto
          select-none
        "
      >
        <div
          className="
            w-full
            bg-panel
            border
            border-border
            rounded-2xl
            p-3
            shadow-sm
            flex
            flex-col
          "
        >
          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-text-muted
              px-2
              mb-2
            "
          >
            Tools
          </span>

          <div className="space-y-2">
            {tools.map((tool) => {
              const active = activeCategory === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className={`
                      w-full
                      h-13
                      flex
                      flex-col
                      items-center
                      justify-center
                      rounded-md
                      text-xs
                      font-bold
                      transition-all
                      capitalize

                      ${
                        active
                          ? "bg-[#6B7A58] text-white"
                          : "text-text-main hover:bg-border/40"
                      }
                    `}
                >
                  <span className="text-lg opacity-80">{tool.icon}</span>

                  <span
                    className="
                        mt-1
                        text-[10px]
                      "
                  >
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <div
        className="
          pointer-events-auto
        "
      >
        {renderPanel()}
      </div>
    </div>
  );
}
