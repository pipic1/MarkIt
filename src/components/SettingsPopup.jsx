const fonts = [
  "Inter",
  "Georgia",
  "Times New Roman",
  "Merriweather",
  "Arial",
  "Roboto",
  "Fira Sans",
  "JetBrains Mono",
];

export default function SettingsPopup({ 
  show, 
  onClose, 
  theme, 
  setTheme, 
  accent, 
  setAccent, 
  fontFamily, 
  setFontFamily, 
  fontSize, 
  setFontSize, 
  editorBg, 
  setEditorBg, 
  editorText, 
  setEditorText 
}) {
  if (!show) return null;

  return (
    <>
      <div className="settings-backdrop" onClick={onClose} />
      <div className="settings-popup">
        <h3>
          <span className="material-symbols-outlined">settings</span>
          Paramètres
        </h3>
        <div className="settings-content">
          <div className="settings-group">
            <label>
              <span>Thème</span>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="auto">Auto (Système)</option>
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="sepia">Sepia</option>
              </select>
            </label>
            <label>
              <span>Accent</span>
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
              />
            </label>
          </div>
          <div className="settings-group">
            <label>
              <span>Police</span>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                {fonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Taille</span>
              <input
                type="number"
                min="12"
                max="28"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="settings-group">
            <label>
              <span>Fond éditeur</span>
              <input
                type="color"
                value={editorBg}
                onChange={(e) => setEditorBg(e.target.value)}
              />
            </label>
            <label>
              <span>Texte éditeur</span>
              <input
                type="color"
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
