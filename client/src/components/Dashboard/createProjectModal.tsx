import { FiX } from "react-icons/fi";
import { Folder, FileText } from "lucide-react";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../../schemas/projectSchema";
import { useCreateProject } from "../../hooks/useProject";
import type { createProjectType } from "../../types/projectTypes";
import { useToastStore } from "../../stores/useToastStore";

export default function CreateProjectModal() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const addToast = useToastStore((state) => state.addToast);
  const isCreateProjectModalOpen = useDashboardStore(
    (state) => state.isCreateProjectModalOpen,
  );
  const setIsCreateProjectModalOpen = useDashboardStore(
    (state) => state.setIsCreateProjectModalOpen,
  );

  const { mutate, isPending } = useCreateProject();

  if (!isCreateProjectModalOpen) return null;

  const onSubmit = (data: createProjectType) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setIsCreateProjectModalOpen(false);

        addToast({
          type: "success",
          title: "Project created",
          message: "Your project has been created successfully.",
        });
      },

      onError: (error: any) => {
        console.log("CREATE PROJECT ERROR:", error);

        addToast({
          type: "error",
          title: "Failed to create project",
          message:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        });
      },
    });
  };

  return (
    <div className="terra-root fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-bg p-6 lg:p-7 shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center relative shrink-0">
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "var(--color-accent)", opacity: 0.16 }}
              />
              <div
                className="absolute inset-1 rounded-full border"
                style={{ borderColor: "var(--color-accent)", opacity: 0.35 }}
              />
              <Folder size={18} strokeWidth={1.6} className="text-dark-accent relative" />
            </div>
            <div>
              <p className="eyebrow mb-1">New project</p>
              <h2 className="font-display text-xl" style={{ fontWeight: 500 }}>
                Create New Project
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateProjectModalOpen(false)}
            className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-text transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          {/* Project Name */}
          <div>
            <label className="eyebrow flex items-center gap-1.5 mb-2">
              <Folder size={12} strokeWidth={1.8} /> Project Name *
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g., Living Room Remodel"
              className="w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 transition-all placeholder:text-muted"
              style={{ "--tw-ring-color": "rgba(124,143,106,0.3)" } as React.CSSProperties}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
            {errors.name && (
              <p className="text-xs mt-1.5 font-mono" style={{ color: "var(--color-danger)" }}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="eyebrow flex items-center gap-1.5 mb-2">
              <FileText size={12} strokeWidth={1.8} /> Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe the layout parameters or client goals..."
              rows={3}
              className="w-full rounded-xl border border-border bg-canvas px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 transition-all resize-none placeholder:text-muted"
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
            {errors.description && (
              <p className="text-xs mt-1.5 font-mono" style={{ color: "var(--color-danger)" }}>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-5 border-t border-border">
            <button
              type="button"
              onClick={() => setIsCreateProjectModalOpen(false)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted hover:bg-canvas hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ backgroundColor: "var(--color-dark-accent)", color: "var(--color-bg)" }}
            >
              {isPending ? "Creating..." : "Initialize Canvas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}