import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Typography from "@tiptap/extension-typography";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Image from "@tiptap/extension-image";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import html2pdf from "html2pdf.js";
import htmlToDocx from "html-to-docx";
import MarkdownIt from "markdown-it";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeFile } from "@tauri-apps/plugin-fs";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import FileMenu from "./components/FileMenu";
import SettingsPopup from "./components/SettingsPopup";
import WelcomeScreen from "./components/WelcomeScreen";
import StatusBar from "./components/StatusBar";
import { defaultMarkdown, themePresets } from "./utils/constants";
import "./App.css";

const markdownParser = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

const turndownService = new TurndownService({
  codeBlockStyle: "fenced",
  headingStyle: "atx",
  bulletListMarker: "-",
});
turndownService.use(gfm);

function App() {
  // Tab management
  const [tabs, setTabs] = useState(() => {
    const savedTabs = localStorage.getItem("mdw:tabs");
    if (savedTabs) {
      return JSON.parse(savedTabs).map(tab => ({ ...tab, isModified: false }));
    }
    return [
      {
        id: Date.now(),
        markdown: localStorage.getItem("mdw:markdown") || defaultMarkdown,
        filePath: localStorage.getItem("mdw:filePath") || "",
        title: localStorage.getItem("mdw:filePath")
          ? localStorage.getItem("mdw:filePath").split(/[\\\/]/).pop()
          : "Sans titre",
        isModified: false,
      },
    ];
  });
  const [activeTabId, setActiveTabId] = useState(() => {
    const savedActiveTabId = localStorage.getItem("mdw:activeTabId");
    if (savedActiveTabId) {
      return Number(savedActiveTabId);
    }
    return tabs[0]?.id || Date.now();
  });

  // Current tab data
  const currentTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  const [markdown, setMarkdown] = useState(currentTab?.markdown || defaultMarkdown);
  const [filePath, setFilePath] = useState(currentTab?.filePath || "");

  const [showCode, setShowCode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem("mdw:markdown") && !localStorage.getItem("mdw:filePath")
  );
  const [activeTab, setActiveTab] = useState("format");
  const [status, setStatus] = useState("Prêt");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("mdw:theme") || "light",
  );
  const [accent, setAccent] = useState(
    () => localStorage.getItem("mdw:accent") || themePresets.light.accent,
  );
  const [fontFamily, setFontFamily] = useState(
    () => localStorage.getItem("mdw:fontFamily") || "Inter",
  );
  const [fontSize, setFontSize] = useState(
    () => Number(localStorage.getItem("mdw:fontSize") || 16),
  );
  const [editorBg, setEditorBg] = useState(
    () => localStorage.getItem("mdw:editorBg") || themePresets.light.editorBg,
  );
  const [editorText, setEditorText] = useState(
    () => localStorage.getItem("mdw:editorText") || themePresets.light.editorText,
  );
  const [ribbonCollapsed, setRibbonCollapsed] = useState(
    () => localStorage.getItem("mdw:ribbonCollapsed") === "true"
  );

  const lastUpdateSource = useRef("editor");
  const exportRef = useRef(null);
  const isSyncingFromTab = useRef(false);
  
  const stats = useMemo(() => {
    const words = markdown.trim().split(/\s+/).filter(Boolean).length;
    const chars = markdown.length;
    return { words, chars };
  }, [markdown]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Subscript,
      Superscript,
      Image,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: markdownParser.render(markdown),
    editorProps: {
      attributes: {
        class: "editor-content",
      },
    },
    onUpdate: ({ editor: tiptap }) => {
      const nextMarkdown = turndownService.turndown(tiptap.getHTML());
      lastUpdateSource.current = "editor";
      setMarkdown(nextMarkdown);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (lastUpdateSource.current === "editor") {
      lastUpdateSource.current = "idle";
      return;
    }
    const html = markdownParser.render(markdown);
    editor.commands.setContent(html, false);
  }, [markdown, editor]);

  useEffect(() => {
    // Skip if we're syncing from tab switch
    if (isSyncingFromTab.current) {
      return;
    }

    localStorage.setItem("mdw:markdown", markdown);
    // Update current tab
    setTabs((prevTabs) => {
      const newTabs = prevTabs.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, markdown, filePath, title: filePath ? filePath.split(/[\\\/]/).pop() : "Sans titre", isModified: true }
          : tab
      );
      localStorage.setItem("mdw:tabs", JSON.stringify(newTabs));
      return newTabs;
    });
  }, [markdown, filePath, activeTabId]);

  useEffect(() => {
    localStorage.setItem("mdw:activeTabId", String(activeTabId));
  }, [activeTabId]);

  useEffect(() => {
    // Sync editor content when switching tabs
    const tab = tabs.find((t) => t.id === activeTabId);
    if (tab) {
      isSyncingFromTab.current = true;
      lastUpdateSource.current = "code";
      setMarkdown(tab.markdown);
      setFilePath(tab.filePath);
      // Reset flag after state updates are applied
      setTimeout(() => {
        isSyncingFromTab.current = false;
      }, 0);
    }
  }, [activeTabId, tabs]);

  useEffect(() => {
    localStorage.setItem("mdw:ribbonCollapsed", String(ribbonCollapsed));
  }, [ribbonCollapsed]);

  useEffect(() => {
    if (!exportRef.current || !editor) return;
    exportRef.current.innerHTML = editor.getHTML();
  }, [editor, markdown]);

  useEffect(() => {
    const preset = themePresets[theme] ?? themePresets.light;

    // Appliquer le thème au document aussi
    setEditorBg(preset.editorBg);
    setEditorText(preset.editorText);
    setAccent(preset.accent);

    const root = document.documentElement;
    root.style.setProperty("--app-background", preset.background);
    root.style.setProperty("--app-panel", preset.panel);
    root.style.setProperty("--app-text", preset.text);
    root.style.setProperty("--app-border", preset.border);
    root.style.setProperty("--app-accent", preset.accent);
    root.style.setProperty("--editor-bg", preset.editorBg);
    root.style.setProperty("--editor-text", preset.editorText);
    root.style.setProperty("--editor-font", fontFamily);
    root.style.setProperty("--editor-size", `${fontSize}px`);
    root.setAttribute("data-theme", theme);

    localStorage.setItem("mdw:theme", theme);
    localStorage.setItem("mdw:accent", preset.accent);
    localStorage.setItem("mdw:fontFamily", fontFamily);
    localStorage.setItem("mdw:fontSize", String(fontSize));
    localStorage.setItem("mdw:editorBg", preset.editorBg);
    localStorage.setItem("mdw:editorText", preset.editorText);
  }, [theme, fontFamily, fontSize]);

  useEffect(() => {
    const handler = (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (event.shiftKey) {
          handleSaveAs();
        } else {
          handleSave();
        }
      }
      if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        handleOpen();
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleOpen = async () => {
    const selected = await open({
      filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
      multiple: false,
    });
    if (!selected || Array.isArray(selected)) return;
    const contents = await readTextFile(selected);

    // Check if file is already open
    const existingTab = tabs.find((tab) => tab.filePath === selected);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      setStatus("Document déjà ouvert");
      return;
    }

    // Create new tab for opened file
    const newTab = {
      id: Date.now(),
      markdown: contents,
      filePath: selected,
      title: selected.split(/[\\\/]/).pop(),
      isModified: false,
    };
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs, newTab];
      localStorage.setItem("mdw:tabs", JSON.stringify(newTabs));
      return newTabs;
    });
    setActiveTabId(newTab.id);

    lastUpdateSource.current = "code";
    setMarkdown(contents);
    setFilePath(selected);
    setStatus("Document chargé");
    setShowWelcome(false);
  };

  const handleSave = async () => {
    if (!filePath) {
      await handleSaveAs();
      return;
    }
    await writeFile(filePath, new TextEncoder().encode(markdown));
    setTabs((prevTabs) => {
      const newTabs = prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, isModified: false } : tab
      );
      localStorage.setItem("mdw:tabs", JSON.stringify(newTabs));
      return newTabs;
    });
    setStatus("Document sauvegardé");
  };

  const handleSaveAs = async () => {
    const selected = await save({
      filters: [{ name: "Markdown", extensions: ["md"] }],
    });
    if (!selected) return;
    await writeFile(selected, new TextEncoder().encode(markdown));
    setFilePath(selected);
    setTabs((prevTabs) => {
      const newTabs = prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, isModified: false, filePath: selected, title: selected.split(/[\\\/]/).pop() } : tab
      );
      localStorage.setItem("mdw:tabs", JSON.stringify(newTabs));
      return newTabs;
    });
    localStorage.setItem("mdw:filePath", selected);
    setStatus("Document sauvegardé");
  };

  const handleExportPdf = async () => {
    if (!exportRef.current) return;
    const selected = await save({
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (!selected) return;
    const worker = html2pdf()
      .from(exportRef.current)
      .set({
        margin: 12,
        filename: "document.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .toPdf();
    const pdf = await worker.get("pdf");
    const arrayBuffer = pdf.output("arraybuffer");
    await writeFile(selected, new Uint8Array(arrayBuffer));
    setStatus("PDF exporté");
  };

  const handleExportDocx = async () => {
    if (!exportRef.current) return;
    const selected = await save({
      filters: [{ name: "DOCX", extensions: ["docx"] }],
    });
    if (!selected) return;
    const arrayBuffer = await htmlToDocx(exportRef.current.innerHTML, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    await writeFile(selected, new Uint8Array(arrayBuffer));
    setStatus("DOCX exporté");
  };

  const handlePrint = async () => {
    if (!exportRef.current) return;
    
    // Générer un PDF temporaire pour l'impression
    try {
      const worker = html2pdf()
        .from(exportRef.current)
        .set({
          margin: 12,
          filename: "impression.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        });
      
      const pdf = worker.output('blob');
      await pdf.then((blob) => {
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        
        if (!printWindow) {
          setStatus("Astuce : Exportez en PDF puis imprimez depuis votre lecteur PDF");
          return;
        }
        
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
        
        setStatus("Ouverture de l'aperçu d'impression...");
      });
    } catch (error) {
      setStatus("Erreur d'impression. Utilisez Export PDF puis imprimez le fichier.");
      console.error(error);
      return;
    }

    // Write the content to the print window
  };

  const handleNew = () => {
    const newTab = {
      id: Date.now(),
      markdown: defaultMarkdown,
      filePath: "",
      title: "Sans titre",
      isModified: false,
    };
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs, newTab];
      localStorage.setItem("mdw:tabs", JSON.stringify(newTabs));
      return newTabs;
    });
    setActiveTabId(newTab.id);
    lastUpdateSource.current = "code";
    setMarkdown(defaultMarkdown);
    setFilePath("");
    setStatus("Nouveau document");
    setShowWelcome(false);
  };

  const handleCloseTab = (tabId, event) => {
    event.stopPropagation();
    if (tabs.length === 1) {
      // Show welcome screen when closing the last tab
      setTabs([]);
      localStorage.removeItem("mdw:tabs");
      localStorage.removeItem("mdw:activeTabId");
      localStorage.removeItem("mdw:markdown");
      localStorage.removeItem("mdw:filePath");
      setShowWelcome(true);
      setStatus("Prêt");
      return;
    }
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    localStorage.setItem("mdw:tabs", JSON.stringify(newTabs));

    // Switch to adjacent tab if closing active tab
    if (tabId === activeTabId) {
      const newActiveTab = newTabs[Math.min(tabIndex, newTabs.length - 1)];
      setActiveTabId(newActiveTab.id);
    }
  };

  const switchToTab = (tabId) => {
    setActiveTabId(tabId);
  };

  const applyLink = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    const previousUrl = editor.getAttributes("link").href;

    // Si du texte est sélectionné, demander juste l'URL
    if (selectedText) {
      const url = window.prompt("URL du lien", previousUrl || "https://");
      if (url === null) return;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      // Sinon, demander le texte ET l'URL
      const text = window.prompt("Texte du lien", "");
      if (!text) return;
      const url = window.prompt("URL du lien", "https://");
      if (!url) return;
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].name.match(/\.(md|markdown)$/i)) {
      const file = files[0];
      const contents = await file.text();
      const path = file.path || file.name;

      // Check if file is already open
      const existingTab = tabs.find((tab) => tab.filePath === path);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        setStatus("Document déjà ouvert");
        return;
      }

      // Create new tab for dropped file
      const newTab = {
        id: Date.now(),
        markdown: contents,
        filePath: path,
        title: file.name,
        isModified: false,
      };
      setTabs((prevTabs) => {
        const newTabs = [...prevTabs, newTab];
        localStorage.setItem("mdw:tabs", JSON.stringify(newTabs));
        return newTabs;
      });
      setActiveTabId(newTab.id);

      lastUpdateSource.current = "code";
      setMarkdown(contents);
      setFilePath(path);
      setStatus("Document chargé");
      setShowWelcome(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setStatus("Markdown copié !");
      setTimeout(() => setStatus("Prêt"), 2000);
    } catch (err) {
      setStatus("Erreur de copie");
    }
  };

  return (
    <div className="app" onDrop={handleDrop} onDragOver={handleDragOver}>
      {showWelcome ? (
        <WelcomeScreen 
          onNew={handleNew}
          onOpen={handleOpen}
          onShowSettings={() => setShowSettings(true)}
        />
      ) : (
        <>
          <Header 
            onUndo={() => editor?.chain().focus().undo().run()}
            onRedo={() => editor?.chain().focus().redo().run()}
            canUndo={editor?.can().undo()}
            canRedo={editor?.can().redo()}
            onToggleFileMenu={() => setShowFileMenu(!showFileMenu)}
            tabs={tabs}
            activeTabId={activeTabId}
            onSwitchTab={switchToTab}
            onCloseTab={handleCloseTab}
            onNewTab={handleNew}
          />

          <section className={`workspace ${showCode ? "split" : "single"}`}>
            <Toolbar 
              editor={editor}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              ribbonCollapsed={ribbonCollapsed}
              setRibbonCollapsed={setRibbonCollapsed}
              applyLink={applyLink}
            />

            <div className="panel editor-panel">
              <EditorContent editor={editor} />
            </div>

            {showCode && (
              <div className="panel code-panel">
                <div className="code-header">Markdown</div>
                <textarea
                  value={markdown}
                  onChange={(event) => {
                    lastUpdateSource.current = "code";
                    setMarkdown(event.target.value);
                  }}
                />
              </div>
            )}
          </section>

          <StatusBar 
            status={status}
            stats={stats}
            showCode={showCode}
            setShowCode={setShowCode}
            onShowSettings={() => setShowSettings(!showSettings)}
            onCopyMarkdown={handleCopyMarkdown}
          />

          <FileMenu 
            show={showFileMenu}
            onClose={() => setShowFileMenu(false)}
            onNew={handleNew}
            onOpen={handleOpen}
            onSave={handleSave}
            onSaveAs={handleSaveAs}
            onExportPdf={handleExportPdf}
            onExportDocx={handleExportDocx}
            onPrint={handlePrint}
          />

          <SettingsPopup 
            show={showSettings}
            onClose={() => setShowSettings(false)}
            theme={theme}
            setTheme={setTheme}
            accent={accent}
            setAccent={setAccent}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
            editorBg={editorBg}
            setEditorBg={setEditorBg}
            editorText={editorText}
            setEditorText={setEditorText}
          />

          <div className="export-sandbox" ref={exportRef} />
        </>
      )}
    </div>
  );
}

export default App;
