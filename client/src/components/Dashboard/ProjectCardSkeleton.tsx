// components/Dashboard/ProjectCardSkeleton.tsx
export default function ProjectCardSkeleton() {
  return (
    <div className="w-full max-w-sm animate-pulse">
      <div className="rounded-2xl border border-gray-200/70 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 pr-12 min-h-14">
          <div className="h-4 w-28 rounded-md bg-gray-200" />
        </div>
        <div className="px-4 pb-4">
          <div className="aspect-video rounded-xl bg-gray-200" />
        </div>
      </div>
      <div className="px-2 pt-3">
        <div className="h-3 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}