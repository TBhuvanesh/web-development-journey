import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <a href="#top" className="footer__brand">
          CineVerse
        </a>

        <p className="footer__tagline">
          Premium stories, blockbuster nights, and cinematic escapes in one dark
          universe.
        </p>

        <div className="footer__actions">
          <span className="footer__badge">Powered by TMDB API</span>
          <a
            className="footer__github"
            href="https://github.com/TBhuvanesh/web-development-journey"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository
          </a>
        </div>

        <p className="footer__credit">Built by Bhuvanesh</p>
      </div>

      <p className="footer__copyright">&copy; 2026 CineVerse. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
