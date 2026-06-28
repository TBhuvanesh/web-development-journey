import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <Link className="navbar__logo" to="/" aria-label="CineVerse home">
        CineVerse
      </Link>

      <nav className="navbar__links" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/tv-shows">TV Shows</NavLink>
        <NavLink to="/#trending">Trending</NavLink>
      </nav>

      <SearchBar />
    </header>
  );
}

export default Navbar;
