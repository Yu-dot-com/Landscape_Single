import { useState, useRef, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useUpdateName } from "../../hooks/useAuth";
import { useGetProjectCount } from "../../hooks/useProject";
import { useToastStore } from "../../stores/useToastStore";

interface ProjectStats {
  totalProjects: number;
  ownProjects: number;
  sharedProjects: number;
}

interface profileProps {
  data: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfileCard({ data }: profileProps) {
  const [username, setUsername] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { mutate: UpdateUsername } = useUpdateName();

  const { isProfileOpen, setIsProfileOpen } = useDashboardStore();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    setUsername(data.username);
  }, [data]);

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus();
  }, [isEditingName]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        if (typeof setIsProfileOpen === "function") {
          setIsProfileOpen(false);
        }
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, setIsProfileOpen]);

  const { data: projectCount, isLoading } = useGetProjectCount();
if (isLoading) {
  return (
    <div className="terra-root fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-6 animate-fade-in">
      <div className="w-95 bg-bg rounded-3xl shadow-[0_25px_60px_-15px_rgba(38,38,31,0.35)] border border-border flex flex-col items-center justify-center py-16 gap-4">
        <div className="relative w-11 h-11">
          <div className="absolute inset-0 rounded-full border-2 border-border" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-accent,#6B7A58)] animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted tracking-wide">
          Loading profile
        </p>
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent,#6B7A58)/50 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent,#6B7A58)/50 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent,#6B7A58)/50 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
  const projectData = (projectCount as any).result;

  if (!isProfileOpen) return null;

  const saveName = () => {
    if (!tempName.trim() || tempName === data.username) {
      setTempName(data.username);
      return;
    }

    UpdateUsername(
      { id: data.id, name: tempName },
      {
        onSuccess: () => {
          setIsEditingName(false);

          addToast({
            type: "success",
            title: "Username updated",
            message: "Your username has been changed successfully.",
          });
        },

        onError: (error: any) => {
          console.error("Failed to update username:", error);

          setTempName(data.username);
          setIsEditingName(false);

          addToast({
            type: "error",
            title: "Update failed",
            message: error?.message || "Failed to update username.",
          });
        },
      },
    );
  };

  const stats: ProjectStats = {
    totalProjects: projectData?.total_projects ?? 0,
    ownProjects: projectData?.own_projects ?? 0,
    sharedProjects: projectData?.shared_projects ?? 0,
  };

  return (
    <div className="terra-root fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-6 animate-fade-in">
      <div
        ref={cardRef}
        className="w-95 bg-bg rounded-3xl shadow-[0_25px_60px_-15px_rgba(38,38,31,0.35)] overflow-hidden border border-border flex flex-col justify-between"
      >
        {/* Banner */}
        <div
          className="relative h-32 p-4"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-sidebar), var(--color-canvas))",
          }}
        >
          <div className="absolute -bottom-10 left-6">
            <div
              className="w-24 h-24 rounded-full border-4 overflow-hidden shadow-md flex items-center justify-center text-white font-display text-2xl"
              style={{
                borderColor: "var(--color-bg)",
                backgroundColor: "#3f5443",
                fontWeight: 500,
              }}
            >
              {getInitials(username)}
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="pt-14 px-6 pb-6 flex-1">
          <div className="group relative mb-1 min-h-9 flex items-center">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                className="font-display text-2xl outline-none w-full py-0.5 bg-transparent border-b"
                style={{ fontWeight: 500, borderColor: "var(--color-canvas)" }}
              />
            ) : (
              <div
                onDoubleClick={() => setIsEditingName(true)}
                className="font-display text-2xl cursor-pointer flex items-center justify-between w-full group"
                style={{ fontWeight: 500 }}
                title="Double click to edit"
              >
                <span>{username}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-text transition-opacity ml-2"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="group relative min-h-6 flex items-center">
            <div className="text-sm text-muted flex items-center justify-between w-full font-mono">
              <span className="truncate">{data.email}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-t border-b border-border bg-canvas py-4 text-center">
          <div className="border-r border-border px-2">
            <div className="font-mono text-lg" style={{ fontWeight: 500 }}>
              {stats.totalProjects}
            </div>
            <div className="eyebrow mt-1">Total</div>
          </div>
          <div className="border-r border-border px-2">
            <div className="font-mono text-lg" style={{ fontWeight: 500 }}>
              {stats.ownProjects}
            </div>
            <div className="eyebrow mt-1">Own</div>
          </div>
          <div className="px-2">
            <div className="font-mono text-lg" style={{ fontWeight: 500 }}>
              {stats.sharedProjects}
            </div>
            <div className="eyebrow mt-1">Shared</div>
          </div>
        </div>
      </div>
    </div>
  );
}