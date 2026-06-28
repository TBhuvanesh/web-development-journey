import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/SearchBar.css";

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        aria-label="Search movies"
        placeholder="Search movies"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" aria-label="Search">
        <span aria-hidden="true">&#8981;</span>
      </button>
    </form>
  );
}

export default SearchBar;
