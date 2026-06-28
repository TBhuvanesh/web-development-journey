import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import { searchMovies } from "../services/api";
import "../styles/SearchResults.css";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadSearchResults() {
      if (!query.trim()) {
        setMovies([]);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const results = await searchMovies(query);

        if (isActive) {
          setMovies(results);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Unable to search movies right now.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadSearchResults();

    return () => {
      isActive = false;
    };
  }, [query]);

  return (
    <div className="search-page">
      <Navbar />

      <main className="search-page__content">
        <p className="search-page__eyebrow">Search</p>
        <h1>{query ? `Results for "${query}"` : "Search Movies"}</h1>

        {error && <p className="search-page__message">{error}</p>}
        {!query && <p className="search-page__message">Type a movie name in the navbar search box.</p>}
        {query && !isLoading && !error && movies.length === 0 && (
          <p className="search-page__message">No movies found.</p>
        )}

        <div className="search-page__grid">
          {isLoading
            ? Array.from({ length: 12 }, (_, index) => <MovieCard key={index} isLoading />)
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SearchResults;
