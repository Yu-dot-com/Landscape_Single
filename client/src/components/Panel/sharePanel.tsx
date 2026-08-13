import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom"; // Swap with "next/navigation" if using Next.js
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiTrash2, FiUserCheck } from "react-icons/fi";
import {
  addMemberSchema,
  type addMemberFormValues,
} from "../../schemas/memberSchema";
import {
  useAddMember,
  useDeleteMember,
  useGetMembers,
} from "../../hooks/useMember";
import { useToastStore } from "../../stores/useToastStore";

interface Collaborator {
  id: string;
  email: string;
  role: "viewer" | "editor" | "admin";
}

interface SharePanelProps {
  onClose: () => void;
}

export default function SharePanel({ onClose }: SharePanelProps) {
  const currentUser = { role: "admin" };
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isLoading } = useGetMembers(projectId ?? "");
  const { mutate: deleteMember } = useDeleteMember();

  const { mutate, isPending } = useAddMember();

  const memberData = (data as unknown as Collaborator[]) ?? [];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addToast = useToastStore((state) => state.addToast);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<addMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
      role: "viewer",
    },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

if (isLoading) {
    return (
      <div className="absolute right-6 top-16 z-50 w-96 rounded-xl border border-border bg-white shadow-xl p-5 text-text-main animate-in fade-in slide-in-from-top-1 duration-150">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-5">
          <div className="h-4 w-28 bg-panel rounded-md animate-pulse" />
          <div className="h-4 w-4 bg-panel rounded animate-pulse" />
        </div>

        {/* Invite form skeleton */}
        <div className="space-y-3 mb-5">
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-panel rounded-lg animate-pulse" />
            <div className="w-21 h-9 bg-panel rounded-lg animate-pulse" />
          </div>
          <div className="h-9 w-full bg-panel rounded-lg animate-pulse" />
        </div>

        {/* Members section skeleton */}
        <div className="border-t border-border pt-4">
          <div className="h-3 w-40 bg-panel rounded-md animate-pulse mb-4" />

          <div className="space-y-3.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-panel" />
                  <div className="h-3 w-36 bg-panel rounded-md" />
                </div>
                <div className="h-5 w-12 bg-panel rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!data) {
    return <p>nodata</p>;
  }
  const onSubmit = (data: addMemberFormValues) => {
    console.log("sharte", data);

    if (!projectId) {
      addToast({
        type: "error",
        title: "Cannot invite member",
        message: "Project ID is missing.",
      });
      return;
    }

    mutate(
      {
        projectId,
        data,
      },
      {
        onSuccess: () => {
          reset();

          addToast({
            type: "success",
            title: "Member invited",
            message: `${data.email} now has access to this project.`,
          });
        },

        onError: (error: any) => {
          console.error("Invite failed:", error);

          addToast({
            type: "error",
            title: "Invitation failed",
            message: error?.message || "Could not invite this member.",
          });
        },
      },
    );
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleRemoveMember = (userId: string) => {
    if (!projectId) {
      addToast({
        type: "error",
        title: "Remove failed",
        message: "Project ID is missing.",
      });
      return;
    }

    deleteMember(
      {
        projectId,
        userId,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Member removed",
            message: "Access has been removed successfully.",
          });
        },

        onError: (error: any) => {
          console.error("Remove member failed:", error);

          addToast({
            type: "error",
            title: "Remove failed",
            message: error?.message || "Could not remove member.",
          });
        },
      },
    );
  };
  console.log({
  isLoading,
  data,
  projectId,
});
  return (
    <div className="absolute right-6 top-16 z-50 w-96 rounded-xl border border-border bg-white shadow-xl p-5 text-text-main animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm tracking-tight">Share Project</h3>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-main text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex gap-2 relative">
          <div className="flex-1 min-w-0">
            <input
              type="email"
              disabled={isPending}
              {...register("email")}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 disabled:opacity-50 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-border focus:ring-[#6B7A58]"
              }`}
              placeholder="Enter email address"
            />
          </div>
          {currentUser.role === "admin" && (
            <div className="relative shrink-0" ref={dropdownRef}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <>

                    {/* Styled Menu List Box */}
                    {isDropdownOpen && !isPending && (
                      <div className="absolute right-0 mt-1.5 w-28 rounded-lg border border-border bg-white shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                        {(["viewer", "editor", "admin"] as const).map(
                          (option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                field.onChange(option);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs capitalize transition-colors hover:bg-neutral-50 cursor-pointer ${
                                field.value === option
                                  ? "text-[#6B7A58] font-semibold bg-[#6B7A58]/5"
                                  : "text-text-main font-medium"
                              }`}
                            >
                              {option}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>

        {errors.email && (
          <p className="text-xs text-red-500 mt-1 pl-1">
            {errors.email.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#6B7A58] hover:bg-[#576446] text-white py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? "Inviting..." : "Invite"}
        </button>
      </form>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center space-x-1.5 mb-3 text-xs font-bold text-text-muted tracking-wider uppercase">
          <FiUserCheck size={12} />
          <span>Members with access ({memberData.length})</span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {memberData.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between text-sm py-0.5"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#6B7A58]/10 text-[#6B7A58] font-bold text-[10px] flex items-center justify-center border border-[#6B7A58]/20 shrink-0">
                  {getInitials(user.email)}
                </div>
                <span className="truncate max-w-45 font-medium text-xs text-text-main">
                  {user.email}
                </span>
              </div>

              {currentUser.role === "admin" && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-bg border border-border px-1.5 py-0.5 rounded-md text-text-muted capitalize font-semibold">
                    {user.role}
                  </span>

                  {user.role !== "admin" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(user.id)}
                      className="text-text-muted hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                      title="Remove access"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
