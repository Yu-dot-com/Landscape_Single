import { useParams, Navigate } from "react-router-dom";
import { useGetProjectItems } from "../hooks/useProject";

export default function CanvasRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) {
    return <Navigate to="/dashboard" replace />;
  }

  const { isLoading, isError } = useGetProjectItems(projectId);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#faf9f6] text-gray-700 font-sans">
        <div className="w-8 h-8 border-4 border-[#6B7A58] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="animate-pulse font-semibold text-xs uppercase tracking-wider text-gray-400">
          Verifying Workspace Security...
        </p>
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
