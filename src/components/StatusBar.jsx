export default function StatusBar({ 
  status, 
  stats, 
  showCode, 
  setShowCode, 
  onShowSettings, 
  onCopyMarkdown 
}) {
  return (
    <footer className="status-bar">
      <span>{status}</span>
      <div className="status-actions">
        <label className="toggle">
          <input
            type="checkbox"
            checked={showCode}
            onChange={(event) => setShowCode(event.target.checked)}
          />
          <span>Voir le code</span>
        </label>
        <button className="status-btn" onClick={onShowSettings} title="Paramètres">
          <span className="material-symbols-outlined">settings</span>
          <span>Paramètres</span>
        </button>
        <button className="status-btn" onClick={onCopyMarkdown} title="Copier le Markdown">
          <span className="material-symbols-outlined">content_copy</span>
          <span>Copier MD</span>
        </button>
        <span>
          {stats.words} mots · {stats.chars} caractères
        </span>
      </div>
    </footer>
  );
}
