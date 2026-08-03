import { Home, FolderKanban, Users, Plus, LogOut, Leaf } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDashboardStore } from "../../stores/useDashboardStore";

interface SidebarProps {
  username: string;
  email: string;
  onLogout: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

function NavItem({ icon: Icon, label, to }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg px-3 py-2.5",
          "text-sm transition-colors",
          isActive
            ? "bg-[#eee9df] text-dark-accent font-medium"
            : "text-muted hover:bg-black/5 hover:text-text",
        ].join(" ")
      }
    >
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
    </NavLink>
  );
}

interface AvatarProps {
  initials: string;
  size?: number;
}

function Avatar({ initials, size = 34 }: AvatarProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--color-dark-accent)",
      }}
    >
      {initials}
    </div>
  );
}

export default function Sidebar({ username, email, onLogout }: SidebarProps) {
  const setIsCreateProjectModalOpen = useDashboardStore(
    (state) => state.setIsCreateProjectModalOpen,
  );
  const setIsProfileOpen = useDashboardStore((state) => state.setIsProfileOpen);

  const initials = username
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 h-screen sticky top-0 bg-sidebar border-r border-border px-5 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            backgroundColor: "var(--color-dark-accent)",
          }}
        >
          <Leaf size={16} color="var(--color-bg)" strokeWidth={2} />
        </div>

        <span className="font-display text-xl" style={{ fontWeight: 500 }}>
          Terra
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        <NavItem icon={Home} label="Home" to="/dashboard" />

        <NavItem
          icon={FolderKanban}
          label="My Projects"
          to="/dashboard/myprojects"
        />

        <NavItem icon={Users} label="Shared Projects" to="/dashboard/shared" />
      </nav>

      {/* Create Project */}
      <button
        onClick={() => setIsCreateProjectModalOpen(true)}
        className="mt-5 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "var(--color-dark-accent)",
          color: "var(--color-bg)",
        }}
      >
        <Plus size={16} />
        Create Project
      </button>

      {/* Divider */}
      <div className="my-6 border-t border-border" />

      {/* User */}
      <div className="mt-auto flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-secondary/40">
        <button
          onClick={() => setIsProfileOpen(true)}
          className="cursor-pointer rounded-full transition-transform hover:scale-105"
          title="Click to edit profile"
        >
          <Avatar initials={initials || "?"} size={42} />
        </button>

        <button
          onClick={() => setIsProfileOpen(true)}
          className="min-w-0 flex-1 cursor-pointer text-left"
          title="Click to edit profile"
        >
          <p className="truncate text-base font-semibold">{username}</p>

          <p className="truncate text-sm text-muted">{email}</p>
        </button>

        <button
          onClick={onLogout}
          className="cursor-pointer rounded-lg p-2 text-muted transition-all hover:bg-danger/10 hover:text-danger"
          title="Log out"
        >
          <LogOut size={20} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}