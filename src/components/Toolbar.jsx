export default function Toolbar({ 
  editor, 
  activeTab, 
  setActiveTab, 
  ribbonCollapsed, 
  setRibbonCollapsed,
  applyLink 
}) {
  return (
    <section className={`toolbar ${ribbonCollapsed ? 'collapsed' : ''}`}>
      <div className="toolbar-header">
        <button
          className="ribbon-toggle-btn"
          onClick={() => setRibbonCollapsed(!ribbonCollapsed)}
          title={ribbonCollapsed ? "Développer le ruban" : "Réduire le ruban"}
        >
          <span className="material-symbols-outlined">
            {ribbonCollapsed ? 'expand_more' : 'expand_less'}
          </span>
          {ribbonCollapsed && <span className="ribbon-toggle-label">Mise en forme</span>}
        </button>
        <div className={`toolbar-tabs ${ribbonCollapsed ? 'hidden' : ''}`}>
          <button
            className={`toolbar-tab ${activeTab === 'format' ? 'active' : ''}`}
            onClick={() => setActiveTab('format')}
          >
            <span className="material-symbols-outlined">format_paint</span>
            <span className="tab-label">Format</span>
          </button>
          <button
            className={`toolbar-tab ${activeTab === 'insert' ? 'active' : ''}`}
            onClick={() => setActiveTab('insert')}
          >
            <span className="material-symbols-outlined">add_box</span>
            <span className="tab-label">Insertion</span>
          </button>
          <button
            className={`toolbar-tab ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            <span className="material-symbols-outlined">table</span>
            <span className="tab-label">Tableaux</span>
          </button>
          <button
            className={`toolbar-tab ${activeTab === 'style' ? 'active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            <span className="material-symbols-outlined">palette</span>
            <span className="tab-label">Style</span>
          </button>
        </div>
      </div>

      <div className={`toolbar-content ${ribbonCollapsed ? 'hidden' : ''}`}>
        {activeTab === 'format' && (
          <>
            <div className="toolbar-section">
              <span className="section-title">Texte</span>
              <div className="toolbar-group">
                <button onClick={() => editor?.chain().focus().toggleBold().run()} title="Gras">
                  <span className="material-symbols-outlined">format_bold</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italique">
                  <span className="material-symbols-outlined">format_italic</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleUnderline().run()} title="Souligné">
                  <span className="material-symbols-outlined">format_underlined</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleStrike().run()} title="Barré">
                  <span className="material-symbols-outlined">strikethrough_s</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleSubscript().run()} title="Indice">
                  <span className="material-symbols-outlined">subscript</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleSuperscript().run()} title="Exposant">
                  <span className="material-symbols-outlined">superscript</span>
                </button>
                <button onClick={() => editor?.chain().focus().unsetAllMarks().run()} title="Effacer le formatage">
                  <span className="material-symbols-outlined">format_clear</span>
                </button>
              </div>
            </div>

            <div className="toolbar-section">
              <span className="section-title">Titres</span>
              <div className="toolbar-group">
                <select
                  className="heading-select"
                  value={
                    editor?.isActive("heading", { level: 1 }) ? "h1" :
                    editor?.isActive("heading", { level: 2 }) ? "h2" :
                    editor?.isActive("heading", { level: 3 }) ? "h3" :
                    editor?.isActive("heading", { level: 4 }) ? "h4" :
                    editor?.isActive("heading", { level: 5 }) ? "h5" :
                    editor?.isActive("heading", { level: 6 }) ? "h6" :
                    "paragraph"
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "paragraph") {
                      editor?.chain().focus().setParagraph().run();
                    } else {
                      const level = parseInt(value.substring(1));
                      editor?.chain().focus().setHeading({ level }).run();
                    }
                  }}
                  title="Style de paragraphe"
                >
                  <option value="paragraph">Paragraphe</option>
                  <option value="h1">Titre 1</option>
                  <option value="h2">Titre 2</option>
                  <option value="h3">Titre 3</option>
                  <option value="h4">Titre 4</option>
                  <option value="h5">Titre 5</option>
                  <option value="h6">Titre 6</option>
                </select>
              </div>
            </div>

            <div className="toolbar-section">
              <span className="section-title">Alignement</span>
              <div className="toolbar-group">
                <button onClick={() => editor?.chain().focus().setTextAlign("left").run()} title="Gauche">
                  <span className="material-symbols-outlined">format_align_left</span>
                </button>
                <button onClick={() => editor?.chain().focus().setTextAlign("center").run()} title="Centre">
                  <span className="material-symbols-outlined">format_align_center</span>
                </button>
                <button onClick={() => editor?.chain().focus().setTextAlign("right").run()} title="Droite">
                  <span className="material-symbols-outlined">format_align_right</span>
                </button>
              </div>
            </div>

            <div className="toolbar-section">
              <span className="section-title">Actions</span>
              <div className="toolbar-group">
                <button onClick={() => editor?.chain().focus().undo().run()} title="Annuler">
                  <span className="material-symbols-outlined">undo</span>
                </button>
                <button onClick={() => editor?.chain().focus().redo().run()} title="Rétablir">
                  <span className="material-symbols-outlined">redo</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'insert' && (
          <>
            <div className="toolbar-section">
              <span className="section-title">Listes</span>
              <div className="toolbar-group">
                <button onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Liste à puces">
                  <span className="material-symbols-outlined">format_list_bulleted</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Liste numérotée">
                  <span className="material-symbols-outlined">format_list_numbered</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleTaskList().run()} title="Liste de tâches">
                  <span className="material-symbols-outlined">checklist</span>
                </button>
              </div>
            </div>

            <div className="toolbar-section">
              <span className="section-title">Blocs</span>
              <div className="toolbar-group">
                <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} title="Citation">
                  <span className="material-symbols-outlined">format_quote</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleCode().run()} title="Code inline">
                  <span className="material-symbols-outlined">code</span>
                </button>
                <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} title="Bloc de code">
                  <span className="material-symbols-outlined">code_blocks</span>
                </button>
                <button onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Ligne horizontale">
                  <span className="material-symbols-outlined">horizontal_rule</span>
                </button>
              </div>
            </div>

            <div className="toolbar-section">
              <span className="section-title">Médias</span>
              <div className="toolbar-group">
                <button onClick={applyLink} title="Insérer un lien">
                  <span className="material-symbols-outlined">link</span>
                </button>
                <button
                  onClick={() => {
                    const url = window.prompt("URL de l'image", "https://");
                    if (url) editor?.chain().focus().setImage({ src: url }).run();
                  }}
                  title="Insérer une image"
                >
                  <span className="material-symbols-outlined">image</span>
                </button>
                <button onClick={() => editor?.chain().focus().setHardBreak().run()} title="Saut de ligne">
                  <span className="material-symbols-outlined">keyboard_return</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'table' && (
          <>
            <div className="toolbar-section">
              <span className="section-title">Tableau</span>
              <div className="toolbar-group">
                <button
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                  title="Insérer un tableau"
                >
                  <span className="material-symbols-outlined">table</span>
                </button>
                <button onClick={() => editor?.chain().focus().deleteTable().run()} title="Supprimer le tableau">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            <div className="toolbar-section">
              <span className="section-title">Colonnes</span>
              <div className="toolbar-group">
                <button onClick={() => editor?.chain().focus().addColumnBefore().run()} title="Colonne avant">
                  <span className="material-symbols-outlined">table_rows</span>
                </button>
                <button onClick={() => editor?.chain().focus().addColumnAfter().run()} title="Colonne après">
                  <span className="material-symbols-outlined">table_rows</span>
                </button>
                <button onClick={() => editor?.chain().focus().deleteColumn().run()} title="Supprimer colonne">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            <div className="toolbar-section">
              <span className="section-title">Lignes</span>
              <div className="toolbar-group">
                <button onClick={() => editor?.chain().focus().addRowBefore().run()} title="Ligne avant">
                  <span className="material-symbols-outlined">table_chart</span>
                </button>
                <button onClick={() => editor?.chain().focus().addRowAfter().run()} title="Ligne après">
                  <span className="material-symbols-outlined">table_chart</span>
                </button>
                <button onClick={() => editor?.chain().focus().deleteRow().run()} title="Supprimer ligne">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'style' && (
          <>
            <div className="toolbar-section">
              <span className="section-title">Couleurs</span>
              <div className="toolbar-group">
                <label className="color-picker-label">
                  <span className="material-symbols-outlined">palette</span>
                  <span>Texte</span>
                  <input
                    type="color"
                    value={editor?.getAttributes("textStyle").color || "#1b1f24"}
                    onChange={(event) =>
                      editor?.chain().focus().setColor(event.target.value).run()
                    }
                    title="Couleur du texte"
                  />
                </label>
                <label className="color-picker-label">
                  <span className="material-symbols-outlined">highlight</span>
                  <span>Surbrillance</span>
                  <input
                    type="color"
                    value={editor?.getAttributes("highlight").color || "#fde68a"}
                    onChange={(event) =>
                      editor?.chain().focus().toggleHighlight({ color: event.target.value }).run()
                    }
                    title="Couleur de surbrillance"
                  />
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
