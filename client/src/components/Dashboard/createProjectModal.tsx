import { FiX, FiFolder, FiFileText } from "react-icons/fi";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../../schemas/projectSchema";
import { useCreateProject } from "../../hooks/useProject";
import type { createProjectType } from "../../types/projectTypes";

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
      thumbnail_url: "",
    },
  });

  const isCreateProjectModalOpen = useDashboardStore(
    (state) => state.isCreateProjectModalOpen,
  );
  const setIsCreateProjectModalOpen = useDashboardStore(
    (state) => state.setIsCreateProjectModalOpen,
  );

  const { mutate, isPending, isSuccess } = useCreateProject();

  if (!isCreateProjectModalOpen) return null;

  const onSubmit = (data: createProjectType) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setIsCreateProjectModalOpen(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        {/* Header */}
        {isSuccess && (
          <div className="p-3 bg-green-50 text-green-700 rounded-xl">
            Login Success.
          </div>
        )}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <FiFolder className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Create New Project
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateProjectModalOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Project Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              <FiFolder className="text-xs" /> Project Name *
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g., Living Room Remodel"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-gray-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              <FiFileText className="text-xs" /> Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe the layout parameters or client goals..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none placeholder:text-gray-400"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ThumbNail */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              <FiFileText className="text-xs" /> Description
            </label>
            <textarea
              {...register("thumbnail_url")}
              placeholder="ThumbNail"
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none placeholder:text-gray-400"
            />
            {errors.thumbnail_url && (
              <p className="text-red-500 text-sm">
                {errors.thumbnail_url.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsCreateProjectModalOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Initialize Canvas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
