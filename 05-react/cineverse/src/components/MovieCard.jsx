import { Link } from "react-router-dom";
import "../styles/MovieCard.css";

function MovieCard({ movie, isLoading }) {
  if (isLoading) {
    return (
      <article className="movie-card movie-card--skeleton" aria-hidden="true">
        <div className="movie-card__poster" />
        <div className="movie-card__info">
          <div className="movie-card__skeleton-title" />
          <div className="movie-card__skeleton-rating" />
        </div>
      </article>
    );
  }

  const mediaType = movie.mediaType || "movie";

  return (
    <Link className="movie-card" to={`/${mediaType}/${movie.id}`} aria-label={`View ${movie.title}`}>
      {movie.poster ? (
        <img className="movie-card__poster" src={movie.poster} alt={movie.title} />
      ) : (
        <div className="movie-card__poster movie-card__poster--empty" />
      )}

      <div className="movie-card__info">
        <h3>{movie.title}</h3>
        <p>
          <span aria-hidden="true">&#9733;</span> {movie.rating}
        </p>
      </div>
    </Link>
  );
}

export default MovieCard;
