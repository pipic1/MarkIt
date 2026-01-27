export default function WelcomeScreen({ onNew, onOpen, onShowSettings }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-hero">
          <span className="material-symbols-outlined welcome-icon">description</span>
          <h1>Markdown Word</h1>
          <p className="welcome-tagline">
            Éditeur WYSIWYG moderne avec support Markdown complet
          </p>
        </div>

        <div className="welcome-features">
          <div className="feature-item">
            <span className="material-symbols-outlined">edit_note</span>
            <span>Édition WYSIWYG</span>
          </div>
          <div className="feature-item">
            <span className="material-symbols-outlined">code</span>
            <span>Markdown complet</span>
          </div>
          <div className="feature-item">
            <span className="material-symbols-outlined">picture_as_pdf</span>
            <span>Export PDF/DOCX</span>
          </div>
          <div className="feature-item">
            <span className="material-symbols-outlined">palette</span>
            <span>Thèmes personnalisables</span>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="welcome-action-primary" onClick={onNew}>
            <span className="material-symbols-outlined">add</span>
            <div>
              <strong>Nouveau document</strong>
              <small>Commencer avec un document vierge</small>
            </div>
          </button>

          <button className="welcome-action-primary" onClick={onOpen}>
            <span className="material-symbols-outlined">folder_open</span>
            <div>
              <strong>Ouvrir un fichier</strong>
              <small>Sélectionner un fichier Markdown existant</small>
            </div>
          </button>
        </div>

        <div className="welcome-drop-zone">
          <span className="material-symbols-outlined">upload_file</span>
          <p>Ou glissez-déposez un fichier .md ici</p>
        </div>

        <button
          className="welcome-settings-btn"
          onClick={onShowSettings}
          title="Paramètres"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </div>
  );
}
