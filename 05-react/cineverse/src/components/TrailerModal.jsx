import "../styles/TrailerModal.css";

function TrailerModal({ trailerKey, onClose }) {
  if (!trailerKey) {
    return null;
  }

  return (
    <div className="trailer-modal" role="dialog" aria-modal="true" aria-label="Movie trailer">
      <button className="trailer-modal__backdrop" type="button" onClick={onClose} aria-label="Close trailer" />

      <div className="trailer-modal__content">
        <button className="trailer-modal__close" type="button" onClick={onClose} aria-label="Close trailer">
          ×
        </button>
        <iframe
          title="Movie trailer"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default TrailerModal;
