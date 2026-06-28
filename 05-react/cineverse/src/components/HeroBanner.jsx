import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHeroSlides, getMovieTrailer } from "../services/api";
import TrailerModal from "./TrailerModal";
import "../styles/HeroBanner.css";

function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState("");
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadSlides() {
      try {
        setIsLoading(true);
        setError("");

        const heroSlides = await getHeroSlides();

        if (isActive) {
          setSlides(heroSlides);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Unable to load hero movies.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadSlides();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length === 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  async function handleTrailerClick() {
    const activeSlide = slides[activeIndex];

    if (!activeSlide) {
      return;
    }

    try {
      const key = await getMovieTrailer(activeSlide.id);
      setTrailerKey(key);
      setIsTrailerOpen(Boolean(key));
      setError(key ? "" : "Trailer is not available for this movie.");
    } catch (err) {
      setError(err.message || "Unable to load trailer.");
    }
  }

  if (isLoading) {
    return (
      <section className="hero hero--loading" id="top">
        <div className="hero__overlay">
          <div className="hero__content">
            <p className="hero__eyebrow">Now Streaming</p>
            <div className="hero__skeleton hero__skeleton--title" />
            <div className="hero__skeleton hero__skeleton--text" />
            <div className="hero__skeleton hero__skeleton--button" />
          </div>
        </div>
      </section>
    );
  }

  const activeSlide = slides[activeIndex];

  if (!activeSlide) {
    return (
      <section className="hero" id="top">
        <div className="hero__overlay">
          <div className="hero__content">
            <p className="hero__eyebrow">Now Streaming</p>
            <h1>CineVerse</h1>
            <p className="hero__description">
              {error || "Trending movies are not available right now."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero" id="top">
      {slides.map((slide, index) => (
        <div
          className={`hero__background ${index === activeIndex ? "hero__background--active" : ""}`}
          key={slide.id}
          style={{ backgroundImage: `url(${slide.backdrop})` }}
        />
      ))}

      <div className="hero__overlay">
        <div className="hero__content" key={activeSlide.id}>
          <p className="hero__eyebrow">Trending This Week</p>
          <h1>{activeSlide.title}</h1>

          <div className="hero__meta">
            <span>&#9733; {activeSlide.rating}</span>
            {activeSlide.genres.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>

          <p className="hero__description">{activeSlide.overview}</p>

          <div className="hero__actions">
            <button
              className="hero__button hero__button--primary"
              type="button"
              onClick={handleTrailerClick}
            >
              Watch Trailer
            </button>
            <Link className="hero__button hero__button--secondary" to={`/movie/${activeSlide.id}`}>
              More Info
            </Link>
          </div>

          {error && <p className="hero__error">{error}</p>}
        </div>

        <div className="hero__thumbnails" aria-label="Hero movie previews">
          {slides.map((slide, index) => (
            <button
              className={`hero__thumbnail ${index === activeIndex ? "hero__thumbnail--active" : ""}`}
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${slide.title}`}
            >
              {slide.poster ? <img src={slide.poster} alt="" /> : <span>{slide.title}</span>}
            </button>
          ))}
        </div>
      </div>

      {isTrailerOpen && (
        <TrailerModal trailerKey={trailerKey} onClose={() => setIsTrailerOpen(false)} />
      )}
    </section>
  );
}

export default HeroBanner;
