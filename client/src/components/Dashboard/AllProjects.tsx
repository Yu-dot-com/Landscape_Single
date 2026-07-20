import { books } from "./data.ts";

export default function AllProjects() {
  return (
    <section>
      <h2 className="font-semibold mb-5">New Release</h2>
      <div className="grid grid-cols-5 gap-6">
        {books.map((book) => (
          <div key={book.id}>
            <img
              src={book.image}
              className="h-48 w-full rounded-xl object-cover"
              alt={book.title}
            />
            <h3 className="text-sm font-semibold mt-3 line-clamp-1">{book.title}</h3>
            <p className="text-xs text-gray-500">{book.author}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white text-xs border border-gray-100">
              {book.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}