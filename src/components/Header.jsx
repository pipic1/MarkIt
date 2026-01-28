import { getCurrentWindow } from "@tauri-apps/api/window";
import TabsBar from "./TabsBar";
import { isTauri } from "../utils/platform";

export default function Header({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onToggleFileMenu,
  tabs,
  activeTabId,
  onSwitchTab,
  onCloseTab,
  onNewTab
}) {
  const handleMinimize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.minimize();
  };

  const handleMaximize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.toggleMaximize();
  };

  const handleClose = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="src/assets/icons/64x64.png" alt="Logo" className="header-logo" />
        <h1>MarkItDown</h1>
        <div className="header-actions">
          <button
            className="header-btn file-menu-btn"
            onClick={onToggleFileMenu}
            title="File"
          >
            <span className="material-symbols-outlined">folder</span>
            <span>File</span>
          </button>
          <button
            className="header-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Annuler (Ctrl+Z)"
          >
            <span className="material-symbols-outlined">undo</span>
          </button>
          <button
            className="header-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Rétablir (Ctrl+Y)"
          >
            <span className="material-symbols-outlined">redo</span>
          </button>
        </div>
      </div>

      <TabsBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSwitchTab={onSwitchTab}
        onCloseTab={onCloseTab}
        onNewTab={onNewTab}
      />

      {isTauri() && (
        <div className="window-controls">
          <button className="window-btn minimize-btn" onClick={handleMinimize} title="Réduire">
            <span className="material-symbols-outlined">minimize</span>
          </button>
          <button className="window-btn maximize-btn" onClick={handleMaximize} title="Agrandir">
            <span className="material-symbols-outlined">crop_square</span>
          </button>
          <button className="window-btn close-btn" onClick={handleClose} title="Fermer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </header>
  );
}
