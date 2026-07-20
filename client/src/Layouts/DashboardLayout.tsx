import ProfileModal from "../components/Dashboard/ProfileModal";
import Sidebar from "../components/Dashboard/Sidebar";
import CreateProjectModal from "../components/Dashboard/createProjectModal";
import { Outlet } from "react-router";
import { useCurrentUser } from "../hooks/useAuth";
import ToastContainer from "../components/ToastContainer";

export default function DashboardLayout() {
  const {data,isLoading} = useCurrentUser()
  if(isLoading) return <p>loading</p>
  if(!data) return <p>error</p>

  return (
    <div className="min-h-screen bg-gray-50/50 flex text-gray-800">
      <Sidebar />
      <ProfileModal data={data.user}/>
            <ToastContainer />
    
      <main className="flex-1 p-8">
        <Outlet />
      </main>
      <CreateProjectModal />
    </div>
  );
}
