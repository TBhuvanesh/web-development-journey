import MovieCard from "./MovieCard";
import "../styles/MovieRow.css";

const skeletonCards = Array.from({ length: 8 }, (_, index) => index);

function MovieRow({ title, movies, isLoading }) {
  return (
    <section className="movie-row" id={title === "Trending Now" ? "trending" : undefined}>
      <div className="movie-row__header">
        <h2>{title}</h2>
      </div>

      <div className="movie-row__list">
        {isLoading
          ? skeletonCards.map((card) => <MovieCard key={card} isLoading />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  );
}

export default MovieRow;
