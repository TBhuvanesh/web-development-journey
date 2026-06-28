import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import { getCategoryHero, getCategoryRows } from "../services/api";
import "../styles/CategoryPage.css";

const categoryTitles = {
  movie: "Movies",
  tv: "TV Shows",
};

const loadingRows = {
  movie: ["Popular Movies", "Top Rated Movies", "Upcoming Movies", "Action Movies", "Comedy Movies"],
  tv: ["Popular TV Shows", "Top Rated TV Shows", "Airing Today", "Drama Series", "Crime Series"],
};

function CategoryPage({ mediaType }) {
  const [hero, setHero] = useState(null);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const title = categoryTitles[mediaType];

  useEffect(() => {
    let isActive = true;

    async function loadCategory() {
      try {
        setIsLoading(true);
        setError("");

        const [categoryHero, categoryRows] = await Promise.all([
          getCategoryHero(mediaType),
          getCategoryRows(mediaType),
        ]);

        if (isActive) {
          setHero(categoryHero);
          setRows(categoryRows);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || `Unable to load ${title}.`);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCategory();

    return () => {
      isActive = false;
    };
  }, [mediaType, title]);

  const rowsToShow = isLoading
    ? loadingRows[mediaType].map((rowTitle) => ({ title: rowTitle, movies: [] }))
    : rows;

  return (
    <div className="category-page">
      <Navbar />

      <main>
        <section
          className="category-hero"
          style={hero?.backdrop ? { backgroundImage: `url(${hero.backdrop})` } : undefined}
        >
          <div className="category-hero__overlay">
            <p className="category-hero__eyebrow">CineVerse Collection</p>
            <h1>{title}</h1>
            <p>
              {hero
                ? `Explore ${hero.title} and more handpicked ${title.toLowerCase()} from TMDB.`
                : `Explore curated ${title.toLowerCase()} across every mood and genre.`}
            </p>
          </div>
        </section>

        <section className="category-page__rows" aria-label={`${title} collections`}>
          {error && <p className="category-page__error">{error}</p>}

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

export default CategoryPage;
