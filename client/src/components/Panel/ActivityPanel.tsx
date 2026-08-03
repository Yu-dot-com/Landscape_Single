import { FiActivity, FiX } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useProjectActivities } from "../../hooks/useActivity";
import { ActivityRow } from "../../pages/DashBoard/Home";

interface Props {
  onClose: () => void;
}

export default function ActivityPanel({ onClose }: Props) {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const { data, isLoading } = useProjectActivities(projectId ?? "", 50);

  const activities = (data as any) ?? [];

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      <aside className="fixed top-0 right-0 z-50 h-screen w-[390px] bg-bg border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-border px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FiActivity size={18} className="text-[#6B7A58]" />

            <h2 className="font-semibold text-text-main">
              {(activities.length ?? 0) > 1
                ? "Recent Activities"
                : "Recent Activity"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-panel transition"
          >
            <FiX />
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {isLoading && (
            <div className="space-y-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-panel shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2 pt-0.5">
                    <div className="h-3 bg-panel rounded-md w-[85%]" />
                    <div className="h-2.5 bg-panel/70 rounded-md w-[55%]" />
                    <div className="h-2 bg-panel/50 rounded-md w-16 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && activities.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FiActivity size={42} className="text-text-muted mb-4" />

              <h3 className="font-semibold">No activity yet</h3>

              <p className="text-sm text-text-muted mt-2 max-w-xs">
                When members edit this project, invite collaborators, or make
                changes, they'll appear here.
              </p>
            </div>
          )}

          {!isLoading && activities.length > 0 && (
            <div>
              {activities.map((activity: any, index: number) => (
                <ActivityRow
                  key={activity.id}
                  item={activity}
                  isLast={index === activities.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
