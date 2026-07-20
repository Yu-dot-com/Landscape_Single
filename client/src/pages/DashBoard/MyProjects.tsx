import ProjectCard from "../../components/Dashboard/ProjectCard";
import { useGetOwnedProjects } from "../../hooks/useProject";

export default function MyProject() {
  const { data: projects, isLoading, isError } = useGetOwnedProjects();

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading projects...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load projects</div>;
  }

  return (
    <div className="p-6">
      <div
        className="
          grid
          gap-8
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {projects?.map((project) => (
          <ProjectCard
            id={project.id}
            key={project.id}
            title={project.name}
            description={project.description ?? "No description available"}
            image={
              project.thumbnail_url ??
              "https://i.pinimg.com/1200x/89/f0/36/89f0365e918c06dea2992f8a6d5f572b.jpg"
            }
            contributors={[]}
          />
        ))}
      </div>

      {projects?.length === 0 && (
        <div className="text-center text-gray-500">No projects found</div>
      )}
    </div>
  );
}
