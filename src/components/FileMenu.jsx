export default function FileMenu({ 
  show, 
  onClose, 
  onNew, 
  onOpen, 
  onSave, 
  onSaveAs, 
  onExportPdf, 
  onExportDocx,
  onPrint 
}) {
  if (!show) return null;

  return (
    <>
      <div className="context-menu-backdrop" onClick={onClose} />
      <div className="context-menu file-menu">
        <button onClick={() => { onNew(); onClose(); }}>
          <span className="material-symbols-outlined">add</span>
          <span>Nouveau</span>
          <span className="shortcut">Ctrl+N</span>
        </button>
        <button onClick={() => { onOpen(); onClose(); }}>
          <span className="material-symbols-outlined">folder_open</span>
          <span>Ouvrir</span>
          <span className="shortcut">Ctrl+O</span>
        </button>
        <div className="context-menu-separator"></div>
        <button onClick={() => { onSave(); onClose(); }}>
          <span className="material-symbols-outlined">save</span>
          <span>Sauvegarder</span>
          <span className="shortcut">Ctrl+S</span>
        </button>
        <button onClick={() => { onSaveAs(); onClose(); }}>
          <span className="material-symbols-outlined">save_as</span>
          <span>Sauvegarder sous</span>
          <span className="shortcut">Ctrl+Shift+S</span>
        </button>
        <div className="context-menu-separator"></div>
        <button onClick={() => { onPrint(); onClose(); }}>
          <span className="material-symbols-outlined">print</span>
          <span>Imprimer</span>
          <span className="shortcut">Ctrl+P</span>
        </button>
        <button onClick={() => { onExportPdf(); onClose(); }}>
          <span className="material-symbols-outlined">picture_as_pdf</span>
          <span>Export PDF</span>
        </button>
        <button onClick={() => { onExportDocx(); onClose(); }}>
          <span className="material-symbols-outlined">description</span>
          <span>Export DOCX</span>
        </button>
      </div>
    </>
  );
}
