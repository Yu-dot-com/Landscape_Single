import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUpdateProject, useDeleteProject } from "../../hooks/useProject";
import { useToastStore } from "../../stores/useToastStore";

interface Collaborator {
  id: string;
  username: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  updated_at: string;
  collaborators: Collaborator[];
}

interface ProjectCardProps {
  project: Project;
}

function getEditedTime(updatedAt: string) {
  const updated = new Date(updatedAt);
  const now = new Date();

  const diffMs = now.getTime() - updated.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return updated.toLocaleDateString();
}

function isRecentlyEdited(updatedAt: string) {
  const updated = new Date(updatedAt);
  const now = new Date();

  const diffMs = now.getTime() - updated.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours < 24;
}

function getInitials(username: string) {
  return username
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: deleteProject } = useDeleteProject();

  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(project.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentTitle(project.name);
  }, [project.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current);
      }
    };
  }, []);

  const recentlyEdited = isRecentlyEdited(project.updated_at);
  const editedTime = getEditedTime(project.updated_at);

  const handleOpenProject = () => {
    navigate(`/landscape/${project.id}`);
  };

  const handleSaveTitle = async () => {
    setIsEditing(false);

    if (!currentTitle.trim() || currentTitle === project.name) {
      setCurrentTitle(project.name);
      return;
    }

    try {
      await updateProject(
        { id: project.id, name: currentTitle },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              title: "Project renamed",
              message: `Project name changed to "${currentTitle}".`,
            });
          },

          onError: (error: any) => {
            console.error("Failed to update title:", error);

            setCurrentTitle(project.name);

            addToast({
              type: "error",
              title: "Rename failed",
              message:
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update project name.",
            });
          },
        },
      );
    } catch (error: any) {
      console.error("Failed to update project title:", error);

      setCurrentTitle(project.name);

      addToast({
        type: "error",
        title: "Rename failed",
        message: error?.message || "Something went wrong.",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setCurrentTitle(project.name);
      setIsEditing(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDeleting) return;

    if (!confirmingDelete) {
      setConfirmingDelete(true);
      confirmTimeoutRef.current = setTimeout(() => {
        setConfirmingDelete(false);
      }, 3000);
      return;
    }

    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current);
    }

    setIsDeleting(true);
    deleteProject(project.id, {
      onSuccess: () => {
        addToast({
          type: "success",
          title: "Project deleted",
          message: `"${project.name}" has been deleted.`,
        });
      },

      onError: (error: any) => {
        console.error("Failed to delete project:", error);

        setIsDeleting(false);
        setConfirmingDelete(false);

        addToast({
          type: "error",
          title: "Delete failed",
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Unable to delete project.",
        });
      },
    });
  };

  return (
    <div
      className="terra-card group/card w-full rounded-2xl overflow-hidden border bg-canvas transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
      style={{
        borderColor: recentlyEdited
          ? "var(--color-dark-accent)"
          : "var(--color-border)",
        opacity: isDeleting ? 0.5 : 1,
        pointerEvents: isDeleting ? "none" : "auto",
      }}
    >
      {/* Project Image */}
      <div
        className="aspect-16/10 relative cursor-pointer overflow-hidden"
        onClick={handleOpenProject}
      >
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[#eee9df] flex items-center justify-center">
            <span className="text-sm text-muted">No preview available</span>
          </div>
        )}

        {recentlyEdited && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide"
            style={{
              backgroundColor: "var(--color-dark-accent)",
              color: "var(--color-bg)",
            }}
          >
            RECENTLY EDITED
          </span>
        )}

        {/* Delete */}
        <button
          onClick={handleDeleteClick}
          title={confirmingDelete ? "Click again to confirm" : "Delete project"}
          className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full transition-all duration-200 ${
            confirmingDelete
              ? "px-2.5 py-1 opacity-100"
              : "p-1.5 opacity-0 group-hover/card:opacity-100"
          }`}
          style={{
            backgroundColor: confirmingDelete
              ? "#b3261e"
              : "rgba(0, 0, 0, 0.55)",
            color: "#fff",
          }}
        >
          <Trash2 size={13} />
          {confirmingDelete && (
            <span className="text-[10px] font-mono tracking-wide">CONFIRM</span>
          )}
        </button>
      </div>

      {/* Project Information */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="font-display text-lg w-full bg-transparent border-b outline-none py-0.5"
              style={{ fontWeight: 500, borderColor: "var(--color-dark-accent)" }}
            />
          ) : (
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Double click to rename"
              className="group/title flex items-center gap-1.5 cursor-text select-none -ml-1 px-1 rounded-md hover:bg-sidebar/60 transition-colors"
            >
              <h3
                className="font-display text-lg truncate"
                style={{ fontWeight: 500 }}
              >
                {currentTitle}
              </h3>
              <Edit2
                size={12}
                className="text-muted opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0"
              />
            </div>
          )}

          <p className="text-sm text-muted mt-1 leading-snug line-clamp-2">
            {project.description || "No description available"}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            {/* Collaborators */}
            {project.collaborators.length > 0 && (
              <div className="flex -space-x-2">
                {project.collaborators.slice(0, 3).map((collaborator) => (
                  <div
                    key={collaborator.id}
                    title={collaborator.username}
                    className="w-6 h-6 rounded-full border-2 border-white text-white text-[9px] font-semibold flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-dark-accent)" }}
                  >
                    {getInitials(collaborator.username)}
                  </div>
                ))}

                {project.collaborators.length > 3 && (
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-[#eee9df] text-stone-700 text-[9px] font-semibold flex items-center justify-center">
                    +{project.collaborators.length - 3}
                  </div>
                )}
              </div>
            )}

            <span className="text-xs text-muted font-mono">{editedTime}</span>
          </div>

          {/* Continue */}
          <button
            onClick={handleOpenProject}
            className="flex items-center gap-1 text-sm font-medium text-dark-accent hover:gap-1.5 transition-all"
          >
            Continue
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}