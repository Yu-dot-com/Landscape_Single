import Sidebar from "../components/Dashboard/Sidebar";
import "../index.css";
import CreateProjectModal from "../components/Dashboard/createProjectModal";
import { Outlet, useNavigate } from "react-router";
import ProfileCard from "../components/Dashboard/ProfileModal";
import { useCurrentUser } from "../hooks/useAuth";
import { useGetProjectCount } from "../hooks/useProject";
import ToastContainer from "../components/ToastContainer";

export default function DashboardLayout() {
  const { data: userResponse, isLoading: userLoading } = useCurrentUser();
  const { data: projectResponse, isLoading: projectLoading } =
    useGetProjectCount();
  const navigate = useNavigate();
  if (userLoading || projectLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-gray-200" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-500 border-r-indigo-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-violet-400 animate-spin [animation-direction:reverse] [animation-duration:0.8s]" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-sm font-medium text-gray-600 tracking-wide">
              Loading dashboard
            </p>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!userResponse || !projectResponse) return <p>error</p>;
  const user = (userResponse as any).user;
  const projectCount = (projectResponse as any).projectCount;
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    navigate("/", {
      replace: true,
    });
  };
  return (
    <div className="min-h-screen bg-gray-50/50 flex text-gray-800">
      <ToastContainer />
      <Sidebar
        username={userResponse.user.username}
        email={userResponse.user.email}
        onLogout={handleLogout}
      />
      <ProfileCard data={{ ...user, ...projectCount }} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
      <CreateProjectModal />
    </div>
  );
}
