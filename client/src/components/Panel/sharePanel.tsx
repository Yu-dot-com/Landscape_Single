import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom"; // Swap with "next/navigation" if using Next.js
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiTrash2, FiUserCheck, FiChevronDown } from "react-icons/fi";
import {
  addMemberSchema,
  type addMemberFormValues,
} from "../../schemas/memberSchema";
import { useAddMember, useDeleteMember, useGetMembers } from "../../hooks/useMember";
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
  const { showToast } = useToastStore();
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isLoading } = useGetMembers(projectId);
  const { mutate:deleteMember } = useDeleteMember()

  const { mutate, isPending } = useAddMember();

  const memberData = data as unknown as  Collaborator[]  | undefined;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return <p>Loading members</p>;
  }
  if(!data){
    return <p>nodata</p>
  }
  const onSubmit = (data: addMemberFormValues) => {
    console.log("sharte", data);
    if (!projectId) {
      console.error("Missing projectId parameter in the URL.");
      return;
    }
    mutate(
      {
        projectId,
        data,
      },

      {
        onSuccess: () => {
          showToast({
            type: "success",

            title: "Member invited",

            message: `${data.email} can now access this project.`,
          });

          reset();
        },

        onError: (error: any) => {
          showToast({
            type: "error",

            title: "Invite failed",

            message:
              error.response?.data?.message ||
              error?.error ||
              "Something went wrong",
          });
        },
      },
    );
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleRemoveMember = (userId:string   ) => {
      if (!projectId) return;

    deleteMember(
    {
      projectId,
      userId,
    },
    {
      onSuccess: () => {
        showToast({
          type: "success",
          title: "Member removed",
          message: "User access has been removed.",
        });
      },

      onError: (error: any) => {
        showToast({
          type: "error",
          title: "Remove failed",
          message:
            error.response?.data?.message ||
            "Failed to remove member.",
        });
      },
    }
  );
     
  }

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
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="h-full flex items-center justify-between gap-1.5 border border-border rounded-lg px-3 py-2 text-xs bg-white hover:bg-neutral-50 active:bg-neutral-100 transition-colors focus:outline-none focus:ring-1 focus:ring-[#6B7A58] cursor-pointer min-w-21.25 disabled:opacity-50"
                    >
                      <span className="capitalize font-medium">
                        {field.value}
                      </span>
                      <FiChevronDown
                        size={12}
                        className={`text-text-muted transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

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
