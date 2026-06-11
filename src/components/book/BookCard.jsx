import { Link } from "react-router-dom";
import { fmtDate } from "@/utils/bookUtils";
import BookCover from "./BookCover";
import GenreBadge from "./GenreBadge";

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <BookCover book={book} variant="card" />
      <div className="card-meta">
        <GenreBadge code={book.genreCode} variant="card" />
        <h3>{book.title}</h3>
        <p>
          {book.author} · {fmtDate(book.createdAt)}
        </p>
      </div>
    </Link>
  );
}
