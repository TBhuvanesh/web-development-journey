import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import Footer from "../components/Footer";
import { getHomeMovies } from "../services/api";
import "../styles/Home.css";

const rowTitles = ["Trending Now", "Popular Movies", "Top Rated", "Action Movies"];

function Home() {
  const [movieRows, setMovieRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadMovies() {
      try {
        setIsLoading(true);
        setError("");

        const rows = await getHomeMovies();

        if (isActive) {
          setMovieRows(rows);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Something went wrong while loading movies.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      isActive = false;
    };
  }, []);

  const rowsToShow = isLoading
    ? rowTitles.map((title) => ({ title, movies: [] }))
    : movieRows;

  return (
    <div className="home">
      <Navbar />
      <main>
        <HeroBanner />

        <section className="home__rows" aria-label="Movie collections">
          {error && <p className="home__error">{error}</p>}

          {rowsToShow.map((row) => (
            <MovieRow
              key={row.title}
              title={row.title}
              movies={row.movies}
              isLoading={isLoading}
            />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
