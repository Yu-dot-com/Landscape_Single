import { useState, useRef, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useUpdateName } from "../../hooks/useAuth";
import { useGetProjectCount } from "../../hooks/useProject";

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
export default function ProfileCard({ data }: profileProps) {
  const [username, setUsername] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);

  const [tempName, setTempName] = useState(username);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const { mutate: UpdateUsername } = useUpdateName();

  const { isProfileOpen, setIsProfileOpen } = useDashboardStore();
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
    return <p>Loading</p>;
  }
  const projectData = (projectCount as any).result;

  if (!isProfileOpen) return null;

  const saveName = () => {
    if (!tempName.trim() || tempName === data.username) {
      setTempName(data.username);
      return;
    }
    console.log(tempName);

    try {
      UpdateUsername(
        { id: data.id, name: tempName },
        {
          onSuccess: () => {
            setIsEditingName(false);
          },
          onError: (error) => {
            console.error("Failed to update username:", error);
            setTempName(data.username); // Rollback state on backend failure
            setIsEditingName(false);
          },
        },
      );
    } catch (error) {
      console.error("Failed to update username:", error);
      setTempName(data.username);
    }
  };

  const stats: ProjectStats = {
    totalProjects: projectData?.total_projects ?? 0,
    ownProjects: projectData?.own_projects ?? 0,
    sharedProjects: projectData?.shared_projects ?? 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-6 animate-fade-in">
      <div
        ref={cardRef}
        className="w-95 bg-white rounded-4xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-50 flex flex-col justify-between font-sans scale-up-center"
      >
        <div className="relative h-36 bg-linear-to-b from-sky-200 to-sky-100 p-4">
          <div className="absolute -bottom-10 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-200 shadow-md">
              <img
                src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Noah"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
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
                className="text-2xl font-bold text-gray-800 border-b border-blue-500 outline-none w-full py-0.5"
              />
            ) : (
              <div
                onDoubleClick={() => setIsEditingName(true)}
                className="text-2xl font-bold text-gray-800 cursor-pointer flex items-center justify-between w-full group"
                title="Double click to edit"
              >
                <span>{username}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity ml-2"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Editable Email */}
          <div className="group relative min-h-6 flex items-center">
            <div className="text-sm text-gray-500 flex items-center justify-between w-full group">
              <span className="truncate">{data.email}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-b border-gray-100 bg-gray-50/50 py-4 text-center">
          <div className="border-r border-gray-100 px-2">
            <div className="text-lg font-bold text-gray-800">
              {stats.totalProjects}
            </div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">
              Total
            </div>
          </div>
          <div className="border-r border-gray-100 px-2">
            <div className="text-lg font-bold text-gray-800">
              {stats.ownProjects}
            </div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Own</div>
          </div>
          <div className="px-2">
            <div className="text-lg font-bold text-gray-800">
              {stats.sharedProjects}
            </div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">
              Shared
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
