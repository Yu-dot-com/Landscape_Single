import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";

import {
  joinRoom,
  leaveRoom,
} from "../collaboration/yjs";
import  { useCurrentUser } from "../hooks/useAuth";
import { setCurrentUser } from "../collaboration/Awareness";
import { useToastStore } from "../stores/useToastStore";

export default function CanvasRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectId } = useParams<{
    projectId: string;
  }>();
    const addToast = useToastStore((state) => state.addToast);
  const navigate=useNavigate();
const {data,isLoading}=useCurrentUser();
  const [yjsStatus, setYjsStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  useEffect(() => {
    if (!projectId) return;

    const { provider } = joinRoom(projectId);

  const handleStatus = ({
 status,
}:{
 status:"connected"|"disconnected"
})=>{

 setYjsStatus(status);


 if(status==="disconnected"){
  addToast({
  type: "info",
  title: "Access revoked",
  message: "You were removed from this project.",
});

   leaveRoom();

   

navigate("/dashboard/myprojects");

 }

};
    provider.on("status", handleStatus);

    return () => {
      provider.off("status", handleStatus);
      leaveRoom();
    };
  }, [projectId]);
useEffect(() => {
  if (!data) return;

  setCurrentUser({
    id: data.user.id,
    email: data.user.email,
    username: data.user.username,
  });
}, [data]);

  if (!projectId) {
    return <Navigate to="/dashboard" replace />;
  }

  if (yjsStatus !== "connected") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#faf9f6]">
        <div className="w-8 h-8 border-4 border-[#6B7A58] border-t-transparent rounded-full animate-spin mb-4" />

        <p className="font-semibold text-gray-700">
          Connecting to collaborative workspace...
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Please wait while we connect you to the project.
        </p>
      </div>
    );
  }
if (isLoading) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#faf9f6]">
      <div className="relative w-10 h-10 mb-5">
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-200" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#6B7A58] animate-spin" />
      </div>

      <p className="font-semibold text-gray-700 tracking-wide">
        Loading your workspace
      </p>

      <div className="flex gap-1.5 mt-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/60 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/60 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A58]/60 animate-bounce" />
      </div>
    </div>
  );
}


  return <>{children}</>;
}