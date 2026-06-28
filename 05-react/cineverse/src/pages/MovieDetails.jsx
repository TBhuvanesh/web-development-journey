import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import TrailerModal from "../components/TrailerModal";
import { getMovieDetails, getSimilarMovies } from "../services/api";
import "../styles/MovieDetails.css";

const relatedSkeletons = Array.from({ length: 8 }, (_, index) => index);

function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const mediaType = location.pathname.startsWith("/tv/") ? "tv" : "movie";
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadMovieDetails() {
      try {
        setIsLoading(true);
        setIsRelatedLoading(false);
        setError("");
        setIsTrailerOpen(false);
        setRelatedMovies([]);

        const details = await getMovieDetails(id, mediaType);

        if (isActive) {
          setMovie(details.movie);
          setCast(details.cast);
          setTrailerKey(details.trailerKey);
          setIsLoading(false);
        }

        if (mediaType === "movie" && isActive) {
          setIsRelatedLoading(true);

          try {
            const similarMovies = await getSimilarMovies(id);

            if (isActive) {
              setRelatedMovies(similarMovies);
            }
          } catch {
            if (isActive) {
              setRelatedMovies([]);
            }
          } finally {
            if (isActive) {
              setIsRelatedLoading(false);
            }
          }
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Unable to load movie details.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadMovieDetails();

    return () => {
      isActive = false;
    };
  }, [id, mediaType]);

  return (
    <div className="details-page">
      <Navbar />

      <main>
        {isLoading && <p className="details-page__message">Loading movie details...</p>}
        {error && <p className="details-page__message details-page__message--error">{error}</p>}

        {!isLoading && !error && movie && (
          <section
            className="details"
            style={movie.backdrop ? { backgroundImage: `url(${movie.backdrop})` } : undefined}
          >
            <div className="details__overlay">
              <Link className="details__back" to="/">
                Back to Home
              </Link>

              <div className="details__layout">
                {movie.poster ? (
                  <img className="details__poster" src={movie.poster} alt={movie.title} />
                ) : (
                  <div className="details__poster details__poster--empty">No Poster</div>
                )}

                <div className="details__content">
                  <p className="details__eyebrow">
                    {mediaType === "tv" ? "TV Show Details" : "Movie Details"}
                  </p>
                  <h1>{movie.title}</h1>

                  <div className="details__meta">
                    <span>&#9733; {movie.rating}</span>
                    <span>{movie.releaseDate}</span>
                    <span>{movie.runtime}</span>
                  </div>

                  <div className="details__genres">
                    {movie.genres.map((genre) => (
                      <span key={genre}>{genre}</span>
                    ))}
                  </div>

                  <p className="details__overview">{movie.overview}</p>

                  <button
                    className="details__trailer"
                    type="button"
                    disabled={!trailerKey}
                    onClick={() => setIsTrailerOpen(true)}
                  >
                    Watch Trailer
                  </button>

                  <section className="details__cast" aria-label="Top cast">
                    <h2>Top Cast</h2>
                    <div className="details__cast-list">
                      {cast.map((person) => (
                        <article key={person.id}>
                          <h3>{person.name}</h3>
                          <p>{person.character}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </section>
        )}

        {!isLoading && !error && movie && mediaType === "movie" && (
          <section className="details__related" aria-label="Related movies">
            <h2>You May Also Like</h2>

            <div className="details__related-carousel">
              <div className="details__related-list">
                {isRelatedLoading
                  ? relatedSkeletons.map((card) => <MovieCard key={card} isLoading />)
                  : relatedMovies.map((relatedMovie) => (
                      <MovieCard key={relatedMovie.id} movie={relatedMovie} />
                    ))}
              </div>
            </div>

            {!isRelatedLoading && relatedMovies.length === 0 && (
              <p className="details__related-empty">No related movies found.</p>
            )}
          </section>
        )}
      </main>

      <Footer />

      {isTrailerOpen && (
        <TrailerModal trailerKey={trailerKey} onClose={() => setIsTrailerOpen(false)} />
      )}
    </div>
  );
}

export default MovieDetails;
