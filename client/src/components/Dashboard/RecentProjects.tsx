import { recentBooks } from "./data.ts";

export default function RecentProjects() {
  return (
    <section className="mb-12">
      <h2 className="font-semibold mb-5">Books you read last</h2>
      <div className="flex gap-6 overflow-hidden">
        {recentBooks.map((book) => (
          <div key={book.id} className="bg-[#263344] rounded-2xl w-67.5 h-27.5 p-3 flex gap-4 text-white shrink-0">
            <img src={book.image} className="w-20 rounded-lg object-cover" alt={book.title} />
            <div className="text-xs flex flex-col justify-center">
              <h3 className="font-semibold line-clamp-2">{book.title}</h3>
              <p className="opacity-70 mt-2">{book.info}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}