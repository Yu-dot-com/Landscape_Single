import { authors } from "./data.ts";

export default function Collaborators() {
  return (
    <aside className="bg-white rounded-3xl p-6 h-fit shadow-sm">
      <h2 className="font-semibold mb-6">Famous Authors</h2>
      {authors.map((author) => (
        <div key={author.id} className="flex items-center gap-4 mb-6 last:mb-0">
          <img src={author.img} className="w-12 h-12 rounded-full object-cover" alt={author.name} />
          <div>
            <h3 className="text-sm font-semibold">{author.name}</h3>
            <p className="text-xs text-gray-400">{author.books}</p>
          </div>
        </div>
      ))}
    </aside>
  );
}