import {
  FiGrid,
  FiPlusCircle,
  FiHome,
  FiBook,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useDashboardStore } from "../../stores/useDashboardStore";

export default function Sidebar() {
  const setIsCreateProjectModalOpen = useDashboardStore(
    (state) => state.setIsCreateProjectModalOpen,
  );

  const setIsProfileOpen = useDashboardStore((state) => state.setIsProfileOpen);

  const menuClass = ({ isActive }: { isActive: boolean }) =>
    `
    flex 
    gap-3 
    items-center 
    cursor-pointer
    px-3
    py-2
    rounded-xl
    transition-all
    duration-200
    ${
      isActive
        ? "bg-[#eee9df] text-black font-semibold"
        : "text-gray-500 hover:bg-gray-100"
    }
    `;

  return (
    <aside className="w-57.5 bg-white p-6 flex flex-col min-h-screen">
      <div className="bg-[#eee9df] rounded-r-2xl px-8 py-10 -ml-8 mb-8">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          className="w-12 h-12 rounded-xl object-cover"
          alt="User avatar"
        />

        <h3 className="mt-4 font-semibold">Welcome Back</h3>

        <p className="font-bold">Sarah</p>
      </div>

      <nav className="space-y-3 text-sm">
        <NavLink to="/dashboard" className={menuClass}>
          <FiHome />
          Home
        </NavLink>

        <button
          onClick={() => setIsCreateProjectModalOpen(true)}
          className="
          flex
          gap-3
          items-center
          cursor-pointer
          px-3
          py-2
          rounded-xl
          text-gray-500
          hover:bg-gray-100
          transition
          w-full
          "
        >
          <FiPlusCircle />
          Create Project
        </button>

        <NavLink to="/dashboard/myprojects" className={menuClass}>
          <FiBook />
          My Projects
        </NavLink>

        <NavLink to="/dashboard/shared" className={menuClass}>
          <FiGrid />
          Collaborative Projects
        </NavLink>

        <button
          className="
          flex
          gap-3
          items-center
          cursor-pointer
          px-3
          py-2
          rounded-xl
          text-gray-500
          hover:bg-gray-100
          transition
          w-full
          "
          onClick={() => setIsProfileOpen(true)}
        >
          <FiUser />
          Profile
        </button>

        <button
          className="
          flex
          gap-3
          items-center
          cursor-pointer
          px-3
          py-2
          rounded-xl
          text-red-500
          hover:bg-red-50
          transition
          w-full
          "
        >
          <FiLogOut />
          Logout
        </button>
      </nav>

      <div className="mt-auto text-xs text-gray-400">
        Product of
        <h2 className="font-bold text-black text-lg">amazon</h2>
      </div>
    </aside>
  );
}
