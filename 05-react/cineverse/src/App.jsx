import { Route, Routes } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<CategoryPage mediaType="movie" />} />
      <Route path="/tv-shows" element={<CategoryPage mediaType="tv" />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/tv/:id" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;
