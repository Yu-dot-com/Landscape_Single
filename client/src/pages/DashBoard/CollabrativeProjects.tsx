import { useMemo } from "react";
import { Users, Clock, LayoutGrid } from "lucide-react";
import ProjectCard from "../../components/Dashboard/ProjectCard";
import ProjectCardSkeleton from "../../components/Dashboard/ProjectCardSkeleton";
import { useGetSharedProjects } from "../../hooks/useProject";
import type { projectType } from "../../types/projectTypes";

const SKELETON_COUNT = 6;
const RECENT_WINDOW_DAYS = 7;

function isRecentlyUpdated(project: projectType): boolean {
  const updated = new Date(project.updated_at).getTime();

  if (Number.isNaN(updated)) return false;

  const windowMs = RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return Date.now() - updated <= windowMs;
}

export default function CollaborativeProjects() {
  const { data, isLoading } = useGetSharedProjects();

  const totalProjects = data?.length ?? 0;

  const recentlyUpdatedCount = useMemo(
    () => data?.filter(isRecentlyUpdated).length ?? 0,
    [data]
  );

  const hasProjects = !isLoading && totalProjects > 0;
  const isEmpty = !isLoading && totalProjects === 0;

  return (
    <div className="min-h-screen bg-bg animate-fade-in">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-medium text-text sm:text-4xl">
            Shared Projects
          </h1>

          <p className="mt-2 text-sm text-muted sm:text-base">
            Projects that you are collaborating on with others.
          </p>
        </div>

        {/* Summary */}
        {!isLoading && totalProjects > 0 && (
          <div className="mb-10 flex flex-col overflow-hidden rounded-2xl border border-border bg-canvas sm:flex-row">

            {/* Total Shared Projects */}
            <div className="flex flex-1 items-center gap-3 border-b border-border px-6 py-4 sm:border-b-0 sm:border-r">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dark-accent/15">
                <LayoutGrid
                  size={16}
                  className="text-dark-accent"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="font-mono text-xl font-medium text-text">
                  {totalProjects}
                </p>

                <p className="eyebrow">
                  Shared Projects
                </p>
              </div>
            </div>

            {/* Recently Updated */}
            <div className="flex flex-1 items-center gap-3 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dark-accent/15">
                <Clock
                  size={16}
                  className="text-dark-accent"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="font-mono text-xl font-medium text-text">
                  {recentlyUpdatedCount}
                </p>

                <p className="eyebrow">
                  Recently Updated
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Projects */}
        {hasProjects && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.map((project: projectType) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-canvas px-6 py-24 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-dark-accent/15">
              <Users
                size={24}
                className="text-dark-accent"
                strokeWidth={1.6}
              />
            </div>

            <p className="font-display text-xl font-medium text-text">
              No shared projects yet
            </p>

            <p className="mt-2 max-w-sm text-sm text-muted">
              When someone invites you to collaborate on a landscape project,
              it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}