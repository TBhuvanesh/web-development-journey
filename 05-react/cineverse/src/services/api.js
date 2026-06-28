const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

function requireApiKey() {
  if (!API_KEY || API_KEY === "your_tmdb_api_key_here") {
    throw new Error("TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file.");
  }
}

function mapTitle(item) {
  return item.title || item.name || "Untitled";
}

function mapMovie(movie, mediaType = "movie") {
  return {
    id: movie.id,
    title: mapTitle(movie),
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "",
    backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : "",
    mediaType,
  };
}

function mapHeroMovie(movie, genres) {
  return {
    id: movie.id,
    title: mapTitle(movie),
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    overview: movie.overview || "No overview available.",
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "",
    backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : "",
    mediaType: "movie",
    genres: movie.genre_ids
      .map((genreId) => genres[genreId])
      .filter(Boolean)
      .slice(0, 3),
  };
}

function mapMovieDetails(movie, mediaType) {
  const tvRuntime = movie.episode_run_time?.[0] ? `${movie.episode_run_time[0]} min` : "";

  return {
    id: movie.id,
    title: mapTitle(movie),
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "",
    backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : "",
    releaseDate: movie.release_date || movie.first_air_date || "Not available",
    runtime: movie.runtime ? `${movie.runtime} min` : tvRuntime || "Not available",
    genres: movie.genres?.map((genre) => genre.name) || [],
    overview: movie.overview || "No overview available.",
    mediaType,
  };
}

async function fetchFromTMDB(endpoint) {
  requireApiKey();

  const separator = endpoint.includes("?") ? "&" : "?";
  const response = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Unable to load movies right now. Please try again later.");
  }

  return response.json();
}

export async function getHomeMovies() {
  const [trending, popular, topRated, action] = await Promise.all([
    fetchFromTMDB("/trending/movie/week"),
    fetchFromTMDB("/movie/popular"),
    fetchFromTMDB("/movie/top_rated"),
    fetchFromTMDB("/discover/movie?with_genres=28"),
  ]);

  return [
    { title: "Trending Now", movies: trending.results.map((movie) => mapMovie(movie, "movie")) },
    { title: "Popular Movies", movies: popular.results.map((movie) => mapMovie(movie, "movie")) },
    { title: "Top Rated", movies: topRated.results.map((movie) => mapMovie(movie, "movie")) },
    { title: "Action Movies", movies: action.results.map((movie) => mapMovie(movie, "movie")) },
  ];
}

export async function getCategoryRows(mediaType) {
  if (mediaType === "tv") {
    const [popular, topRated, airingToday, drama, crime] = await Promise.all([
      fetchFromTMDB("/tv/popular"),
      fetchFromTMDB("/tv/top_rated"),
      fetchFromTMDB("/tv/airing_today"),
      fetchFromTMDB("/discover/tv?with_genres=18"),
      fetchFromTMDB("/discover/tv?with_genres=80"),
    ]);

    return [
      { title: "Popular TV Shows", movies: popular.results.map((show) => mapMovie(show, "tv")) },
      { title: "Top Rated TV Shows", movies: topRated.results.map((show) => mapMovie(show, "tv")) },
      { title: "Airing Today", movies: airingToday.results.map((show) => mapMovie(show, "tv")) },
      { title: "Drama Series", movies: drama.results.map((show) => mapMovie(show, "tv")) },
      { title: "Crime Series", movies: crime.results.map((show) => mapMovie(show, "tv")) },
    ];
  }

  const [popular, topRated, upcoming, action, comedy] = await Promise.all([
    fetchFromTMDB("/movie/popular"),
    fetchFromTMDB("/movie/top_rated"),
    fetchFromTMDB("/movie/upcoming"),
    fetchFromTMDB("/discover/movie?with_genres=28"),
    fetchFromTMDB("/discover/movie?with_genres=35"),
  ]);

  return [
    { title: "Popular Movies", movies: popular.results.map((movie) => mapMovie(movie, "movie")) },
    { title: "Top Rated Movies", movies: topRated.results.map((movie) => mapMovie(movie, "movie")) },
    { title: "Upcoming Movies", movies: upcoming.results.map((movie) => mapMovie(movie, "movie")) },
    { title: "Action Movies", movies: action.results.map((movie) => mapMovie(movie, "movie")) },
    { title: "Comedy Movies", movies: comedy.results.map((movie) => mapMovie(movie, "movie")) },
  ];
}

export async function getCategoryHero(mediaType) {
  const endpoint = mediaType === "tv" ? "/tv/popular" : "/movie/popular";
  const data = await fetchFromTMDB(endpoint);
  const item = data.results.find((result) => result.backdrop_path) || data.results[0];

  return item ? mapMovie(item, mediaType) : null;
}

export async function getHeroSlides() {
  const [trending, genreList] = await Promise.all([
    fetchFromTMDB("/trending/movie/week"),
    fetchFromTMDB("/genre/movie/list"),
  ]);

  const genres = genreList.genres.reduce((genreMap, genre) => {
    return { ...genreMap, [genre.id]: genre.name };
  }, {});

  return trending.results
    .filter((movie) => movie.backdrop_path)
    .slice(0, 5)
    .map((movie) => mapHeroMovie(movie, genres));
}

export async function searchMovies(query) {
  if (!query.trim()) {
    return [];
  }

  const data = await fetchFromTMDB(
    `/search/movie?query=${encodeURIComponent(query.trim())}&include_adult=false`
  );

  return data.results.map((movie) => mapMovie(movie, "movie"));
}

export async function getMovieTrailer(movieId, mediaType = "movie") {
  const videos = await fetchFromTMDB(`/${mediaType}/${movieId}/videos`);
  const trailer = videos.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return trailer?.key || "";
}

export async function getSimilarMovies(movieId) {
  const data = await fetchFromTMDB(`/movie/${movieId}/similar`);
  return data.results.map((movie) => mapMovie(movie, "movie"));
}

export async function getMovieDetails(movieId, mediaType = "movie") {
  const [details, credits, videos] = await Promise.all([
    fetchFromTMDB(`/${mediaType}/${movieId}`),
    fetchFromTMDB(`/${mediaType}/${movieId}/credits`),
    fetchFromTMDB(`/${mediaType}/${movieId}/videos`),
  ]);

  const trailer = videos.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return {
    movie: mapMovieDetails(details, mediaType),
    cast: credits.cast.slice(0, 5).map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character,
    })),
    trailerKey: trailer?.key || "",
  };
}
