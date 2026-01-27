export default function TabsBar({ tabs, activeTabId, onSwitchTab, onCloseTab, onNewTab }) {
  return (
    <div className="tabs-bar" data-tauri-drag-region>
      <div className="tabs-container" data-tauri-drag-region>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? "active" : ""}`}
            onClick={() => onSwitchTab(tab.id)}
            title={tab.filePath || tab.title}
          >
            {tab.isModified && <span className="tab-modified-indicator" data-tauri-drag-region></span>}
            <span className="tab-title">{tab.title}</span>
            <button
              className="tab-close"
              onClick={(e) => onCloseTab(tab.id, e)}
              title="Fermer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
        <button className="tab-new" onClick={onNewTab} title="Nouveau document">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
}
