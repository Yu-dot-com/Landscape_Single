import { useEffect, useRef, useState } from "react";
import {
  FiMoreHorizontal,
  FiDownload,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useDeleteProject, useUpdateProject } from "../../hooks/useProject";
import { useNavigate } from "react-router-dom";

interface Contributor {
  id: string;
  name: string;
  avatar?: string;
}

interface ProjectCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  contributors: Contributor[];
}

export default function ProjectCard({ id, title, image }: ProjectCardProps) {
  const { mutate: deleteProject, isPending } = useDeleteProject();
  const selectedProjectId = useDashboardStore(
    (state) => state.selectedProjectId,
  );
  const setSelectedProjectId = useDashboardStore(
    (state) => state.setSelectedProjectId,
  );
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isMenuOpen = selectedProjectId === id;

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const { mutateAsync: updateProject } = useUpdateProject();
  
  const handleSaveTitle = async () => {
    setIsEditing(false);
    console.log(currentTitle);
    if (!currentTitle.trim() || currentTitle === title) {
      setCurrentTitle(title);
      return;
    }
    console.log(currentTitle);
    try {
      await updateProject(
        { id, name: currentTitle },
        {
          onError: (error) => {
            console.error("Failed to update title:", error);
            setCurrentTitle(title); // Rollback state on backend fail
          },
        },
      );
    } catch (error) {
      console.error("Failed to update project title:", error);
      setCurrentTitle(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setCurrentTitle(title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setSelectedProjectId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setSelectedProjectId]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMenuOpen) {
      setSelectedProjectId(null);
    } else {
      setSelectedProjectId(id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${currentTitle}"?`)) {
      deleteProject(id, {
        onSuccess: () => {
          setSelectedProjectId(null);
        },
      });
    }
  };

  return (
    <div  ref={cardRef} className="w-full max-w-sm">
      <div className="group relative rounded-2xl border border-gray-200/70 bg-white/60 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-visible">
        {/* Three dot menu */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleMenuToggle}
            disabled={isPending}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
          >
            <FiMoreHorizontal size={18} />
          </button>
          {/* Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden animate-in">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition">
                <FiDownload size={15} />
                Download
              </button>

              <button
                onClick={handleDelete}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
              >
                <FiTrash2 size={15} />
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 pr-12 min-h-14">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              className="w-full text-base font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none px-0 py-0.5"
            />
          ) : (
            <div
              onDoubleClick={() => setIsEditing(true)}
              title="Double click to rename"
              className="
                group/title flex items-center gap-2 max-w-full cursor-pointer select-none 
                hover:bg-gray-100/80 rounded-lg px-2 py-1 -mx-2 transition duration-200
              "
            >
              <h2 className="text-base font-semibold text-gray-900 truncate max-w-40 sm:max-w-45">
                {currentTitle}
              </h2>
              <FiEdit2
                size={13}
                className="text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity duration-150 shrink-0"
              />
            </div>
          )}
        </div>

        {/* Image */}
        <div className="px-4 pb-4">
          <div className="overflow-hidden rounded-xl aspect-video">
            <img onClick={()=>navigate(`/landscape/${id}`)}
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Description outside card */}
      <div className="px-2 pt-3">
        {/* <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
          {description}
        </p> */}

        <button onClick={()=>navigate(`/landscape/${id}`)} className="mt-3 text-sm font-medium text-gray-900 hover:text-gray-600 transition">
          Open Project →
        </button>
      </div>
    </div>
  );
}
