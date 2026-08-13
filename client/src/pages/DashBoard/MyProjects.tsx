import { useMemo } from "react";
import { Plus, Sprout, Clock, LayoutGrid } from "lucide-react";
import ProjectCard from "../../components/Dashboard/ProjectCard";
import ProjectCardSkeleton from "../../components/Dashboard/ProjectCardSkeleton";
import { useGetOwnedProjects } from "../../hooks/useProject";
import type { projectType } from "../../types/projectTypes";
import { useDashboardStore } from "../../stores/useDashboardStore";

const SKELETON_COUNT = 6;

const RECENT_WINDOW_DAYS = 7;

function isRecentlyUpdated(project: projectType): boolean {
  const updated = new Date(project.updated_at).getTime();

  if (Number.isNaN(updated)) {
    return false;
  }

  const windowMs =
    RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return Date.now() - updated <= windowMs;
}

export default function MyProject() {
  const { data, isLoading } = useGetOwnedProjects();

  const totalProjects = data?.length ?? 0;
  const recentlyUpdatedCount = useMemo(
    () => data?.filter(isRecentlyUpdated).length ?? 0,
    [data]
  );

  const hasProjects = !isLoading && totalProjects > 0;
  const isEmpty = !isLoading && totalProjects === 0;

 const setIsCreateProjectModalOpen =
  useDashboardStore(
    (state) => state.setIsCreateProjectModalOpen
  );

const handleCreateProject = () => {
  setIsCreateProjectModalOpen(true);
};

  return (
    <div className="min-h-screen bg-bg animate-fade-in">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-text">
              My Projects
            </h1>
            <p className="text-muted mt-2 text-sm sm:text-base">
              The projects you own and are actively designing.
            </p>
          </div>
          <button
            onClick={handleCreateProject}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium bg-dark-accent text-bg transition-transform hover:-translate-y-0.5 self-start sm:self-auto"
          >
            <Plus size={16} />
            Create Project
          </button>
        </div>

        {/* Summary */}
        {!isLoading && totalProjects > 0 && (
          <div className="flex flex-col sm:flex-row rounded-2xl border border-border bg-canvas overflow-hidden mb-10">
            <div className="flex-1 flex items-center gap-3 px-6 py-4 border-b sm:border-b-0 sm:border-r border-border">
              <div className="w-9 h-9 rounded-full bg-dark-accent/15 flex items-center justify-center shrink-0">
                <LayoutGrid size={16} className="text-dark-accent" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-mono text-xl font-medium text-text">{totalProjects}</p>
                <p className="eyebrow">Total Projects</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-6 py-4">
              <div className="w-9 h-9 rounded-full bg-dark-accent/15 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-dark-accent" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-mono text-xl font-medium text-text">{recentlyUpdatedCount}</p>
                <p className="eyebrow">Recently Updated</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 flex flex-col  animate-in fade-in slide-in-from-bottom-3 duration-500">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Project grid */}
        {hasProjects && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 flex flex-col  animate-in fade-in slide-in-from-bottom-3 duration-500">
            {data?.map((project: projectType) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center text-center py-24 px-6 rounded-2xl border border-border bg-canvas">
            <div className="w-14 h-14 rounded-full bg-dark-accent/15 flex items-center justify-center mb-5">
              <Sprout size={24} className="text-dark-accent" strokeWidth={1.6} />
            </div>
            <p className="font-display text-xl font-medium text-text">No projects yet</p>
            <p className="text-sm text-muted mt-2 max-w-sm">
              Create your first project to start designing a landscape with your team.
            </p>
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 mt-6 px-5 py-3 rounded-full text-sm font-medium bg-dark-accent text-bg transition-transform hover:-translate-y-0.5"
            >
              <Plus size={16} />
              Create Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}