import { ArrowUpRight } from "lucide-react";
import { useCurrentUser } from "../../hooks/useAuth";
import {
  useGetProjectCount,
  useGetRecentProjects,
} from "../../hooks/useProject";
import { getTimeAgo } from "../../utils/getTimeAgo";
import { useNavigate } from "react-router";
import { useRecentActivities } from "../../hooks/useActivity";

const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340..600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

    :root {
      --color-bg: #FAF7F1;
      --color-canvas: #F5F1E7;
      --color-sidebar: #F1ECDF;
      --color-text: #26261F;
      --color-muted: #8B8874;
      --color-border: #E3DDCC;
      --color-accent: #7C8F6A;
      --color-dark-accent: #3F4A32;
      --color-danger: #A8583C;
    }

    .terra-root { font-family: 'IBM Plex Sans', sans-serif; color: var(--color-text); background: var(--color-bg); }
    .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
    .font-mono { font-family: 'IBM Plex Mono', monospace; }

    .bg-bg { background-color: var(--color-bg); }
    .bg-canvas { background-color: var(--color-canvas); }
    .bg-sidebar { background-color: var(--color-sidebar); }
    .text-text { color: var(--color-text); }
    .text-muted { color: var(--color-muted); }
    .border-border { border-color: var(--color-border); }
    .bg-accent { background-color: var(--color-dark-accent); }
    .text-accent { color: var(--color-dark-accent); }
    .bg-dark-accent { background-color: var(--color-dark-accent); }
    .text-dark-accent { color: var(--color-dark-accent); }
    .bg-danger { background-color: var(--color-danger); }
    .text-danger { color: var(--color-danger); }
    .fill-accent { fill: var(--color-dark-accent); }
    .stroke-accent { stroke: var(--color-dark-accent); }
    .fill-ink { fill: var(--color-text); }
    .stroke-border { stroke: var(--color-border); }

    .eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-muted); }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }

    .terra-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
    .terra-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -18px rgba(38,38,31,0.35); }

    .terra-tile:hover .terra-tile-plate { transform: scale(1.06); }
    .terra-tile-plate { transition: transform 0.3s ease; }
  `}</style>
);

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function Avatar({ initials, size = 28 }: { initials: any; size: any }) {
  return (
    <div
      className="rounded-full flex items-center justify-center border-2 border-bg font-mono"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        backgroundColor: "var(--color-dark-accent)",
        color: "var(--color-bg)",
      }}
    >
      {getInitials(initials)}
    </div>
  );
}

function ProjectCard({
  project,
  recentlyEdited = false,
}: {
  project: any;
  recentlyEdited: boolean;
}) {
  const navigate = useNavigate();

  const handleOpenProject = () => {
    navigate(`/landscape/${project.id}`);
  };
  return (
    <div
      className="terra-card w-full rounded-2xl overflow-hidden border bg-canvas"
      style={{
        borderColor: project.recent
          ? "var(--color-dark-accent)"
          : "var(--color-border)",
      }}
    >
      <div onClick={handleOpenProject} className="flex flex-col md:flex-row">
        {/* Project Preview */}
        <div className="relative w-full md:w-[42%] lg:w-[38%] aspect-16/10 md:aspect-auto md:min-h-240px">
          <img src={project.thumbnail_url} />
          {recentlyEdited && (
            <span
              className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide"
              style={{
                backgroundColor: "var(--color-dark-accent)",
                color: "var(--color-bg)",
              }}
            >
              RECENTLY EDITED
            </span>
          )}
        </div>

        {/* Project Information */}
        <div className="flex flex-1 flex-col p-6 lg:p-8">
          {/* Header */}
          <div>
            <h3
              className="font-display text-2xl lg:text-3xl"
              style={{ fontWeight: 500 }}
            >
              {project.name}
            </h3>

            <p className="text-sm lg:text-base text-muted mt-2 max-w-2xl leading-relaxed">
              {project.description || "No description available"}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto pt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            {/* Collaborators + Last Edited */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {project.collaborators?.map((c: any, i: number) => (
                  <Avatar
                    key={c.id ?? i}
                    initials={c.username ?? c}
                    size={32}
                  />
                ))}
              </div>

              <span className="text-xs text-muted font-mono">
                {getTimeAgo(project.updated_at)}
              </span>
            </div>

            {/* Continue */}
            <button className="flex items-center gap-2 text-sm font-medium text-dark-accent hover:gap-3 transition-all">
              Continue
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function StatChip({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="w-full px-6 py-5">
      <p className="font-mono text-2xl font-medium">{value}</p>

      <p className="eyebrow mt-1">{label}</p>
    </div>
  );
}

export function ActivityRow({ item, isLast }: { item: any; isLast: boolean }) {
  const initials = item.actor_username
    ?.split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase();

  const getMessage = () => {
    switch (item.action) {
      case "PROJECT_CREATED":
        return (
          <>
            <span className="font-medium">{item.actor_username}</span> created{" "}
            <span className="font-medium">{item.metadata.projectName}</span>
          </>
        );

      case "PROJECT_UPDATED":
        return (
          <>
            <span className="font-medium">{item.actor_username}</span> updated{" "}
            <span className="font-medium">{item.metadata.projectName}</span>
          </>
        );

      case "PROJECT_DELETED":
        return (
          <>
            <span className="font-medium">{item.actor_username}</span> deleted{" "}
            <span className="font-medium">{item.metadata.projectName}</span>
          </>
        );

      case "MEMBER_ADDED":
        return (
          <>
            <span className="font-medium">{item.actor_username}</span> added{" "}
            <span className="font-medium">{item.metadata.memberName}</span> to{" "}
            <span className="font-medium">{item.metadata.projectName}</span>
          </>
        );
      
      case "PROJECT_RENAMED":
         return (
          <>
            <span className="font-medium">{item.actor_username}</span> renamed{" "}
             <span className="font-medium">
              {item.metadata.oldProjectName} 
            </span> to {" "}
            <span className="font-medium">
              {item.metadata.newProjectName}
            </span>
          </>
        );

      case "MEMBER_DELETED":
        return (
          <>
            <span className="font-medium">{item.actor_username}</span> removed{" "}
            <span className="font-medium">{item.metadata.memberName}</span> from{" "}
            <span className="font-medium">{item.metadata.projectName}</span>
          </>
        );

      case "MEMBER_ROLE_UPDATED":
        return (
          <>
            <span className="font-medium">{item.actor_username}</span> changed{" "}
            <span className="font-medium">{item.metadata.memberName}</span>
            's role to{" "}
            <span className="font-medium">{item.metadata.memberRole}</span>
          </>
        );

      default:
        return item.action;
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <Avatar initials={initials} size={26} />
        {!isLast && <div className="w-px flex-1 bg-border mt-2" />}
      </div>

      <div className="flex-1 pb-5">
        <p className="text-sm leading-relaxed">{getMessage()}</p>

        <p className="text-xs text-muted font-mono mt-1">
          {getTimeAgo(item.created_at)}
        </p>
      </div>
    </div>
  );
}
4;

export default function Dashboard() {
  const { data: currentUser, isLoading: loadingUser } = useCurrentUser();
  const { data: RecentProjects, isLoading: loadingRecent } =
    useGetRecentProjects();
  const { data: data = [], isLoading: loadingActivities } =
    useRecentActivities();
  const recentActivities = data as [] | undefined;
  const { data: projectResponse, isLoading: loadingCount } =
    useGetProjectCount();
if (loadingRecent || loadingUser || loadingCount || loadingActivities) {
  return (
    <div className="terra-root min-h-screen w-full flex flex-col items-center justify-center bg-bg)]">     <ThemeStyle />

      <div className="relative w-12 h-12 mb-6">
        <div className="absolute inset-0 rounded-full border-[3px] border-border" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent animate-spin" />
      </div>

      <p className="font-display text-lg text-text)]racking-wide" style={{ fontWeight: 500 }}>
        Loading your workspace
      </p>

      <div className="flex gap-1.5 mt-4">
        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" />
      </div>
    </div>
  );
}
  const projectCount = (projectResponse as any).result;
  console.log(projectResponse);
  return (
    <div className="terra-root min-h-screen w-full flex">
      <ThemeStyle />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-5 sm:px-8 lg:px-12 py-8 lg:py-10 max-w-6xl mx-auto w-full animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
            <div>
              <p className="eyebrow mb-2">Dashboard</p>
              <h1
                className="font-display text-3xl sm:text-4xl"
                style={{ fontWeight: 500 }}
              >
                Welcome back, {currentUser?.user.username}.
              </h1>
              {/* <p className="text-muted mt-2">Bring your next landscape idea to life.</p> */}
            </div>
          </div>

          {/* Continue Designing */}
          <section className="mb-12">
            <p className="eyebrow mb-2">Pick up where you left off</p>
            <h2
              className="font-display text-2xl mb-5"
              style={{ fontWeight: 500 }}
            >
              Continue Designing
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {RecentProjects?.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  recentlyEdited={RecentProjects?.[0]?.id === p.id}
                />
              ))}
            </div>
          </section>
          <section className="mb-12">
            <p className="eyebrow mb-2">At a glance</p>

            <h2
              className="font-display text-2xl mb-5"
              style={{ fontWeight: 500 }}
            >
              Workspace Overview
            </h2>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 rounded-2xl border border-border bg-canvas overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-border">
              <StatChip value={projectCount.own_projects} label="My Projects" />

              <StatChip
                value={projectCount.shared_projects}
                label="Shared Projects"
              />

              <StatChip
                value={projectCount.total_projects}
                label="Total Projects"
              />
            </div>
          </section>

          <div className="lg:col-span-2">
            <h2
              className="font-display text-2xl mb-5"
              style={{ fontWeight: 500 }}
            >
              {(recentActivities?.length ?? 0) > 1
                ? "Recent Activities"
                : "Recent Activity"}
            </h2>

            <div className="rounded-2xl border border-border bg-canvas p-6">
              {recentActivities?.length ? (
                recentActivities?.map((item: any, index: number) => (
                  <ActivityRow
                    key={item.id}
                    item={item}
                    isLast={index === recentActivities?.length - 1}
                  />
                ))
              ) : (
                <p className="text-sm text-muted">No recent activity yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
