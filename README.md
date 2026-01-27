# MarkIt - Open Source Markdown Writer

An open‑source, local‑first Markdown editor built with React and Tauri, featuring multiple editing modes for a smooth and playful writing experience ✨

![1000001592](https://github.com/user-attachments/assets/3c60378d-fad1-4515-bea5-4c0265e50310)


A modern, full-featured WYSIWYG Markdown editor built with Tauri and React.

You can test it on the web or install it locally : https://markit-writer.netlify.app/

## Key Features

<img width="2560" height="1334" alt="1000001590" src="https://github.com/user-attachments/assets/b55d446e-9152-465e-9758-1a8c634eb20a" />


Editing
- Real-time WYSIWYG editing
- Full GitHub Flavored Markdown (GFM) support
- Multi-tab document editing
- Drag-and-drop support for .md files

Formatting
- Bold, italic, underline, strikethrough
- Headings (H1–H6)
- Bulleted, numbered and task lists
- Tables with header rows
- Blockquotes and code blocks
- Links and images
- Subscript and superscript
- Text color and highlight

Export & Printing
- PDF export (high quality)
- DOCX export (Microsoft Word compatible)
- Direct printing (Ctrl+P)
- Native Markdown save

Customization
- Three themes: Light, Dark, Sepia
- Eight font options: Inter, Georgia, Times New Roman, Merriweather, Arial, Roboto, Fira Sans, JetBrains Mono
- Customizable background, text, and accent colors

## Development

Prerequisites
- Node.js 18+
- Rust (required for Tauri)
- npm or yarn

Install
```bash
npm install
```

Run (development)
```bash
npm run dev
# or
npm run tauri dev
```

Build
```bash
npm run tauri build
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx       # Window controls and header
│   ├── TabsBar.jsx      # Multi-document tab bar
│   ├── Toolbar.jsx      # Formatting toolbar
│   ├── FileMenu.jsx     # File menu
│   ├── SettingsPopup.jsx# Settings modal
│   ├── WelcomeScreen.jsx# Welcome screen
│   └── StatusBar.jsx    # Status bar
├── utils/
│   └── constants.js     # Constants (themes, default markdown)
├── App.jsx              # Root component
├── App.css              # Styles
└── main.jsx             # Entry point
```

## Keyboard Shortcuts

| Shortcut           | Action                 |
|--------------------|------------------------|
| Ctrl+S             | Save                   |
| Ctrl+Shift+S       | Save As                |
| Ctrl+O             | Open file              |
| Ctrl+P             | Print                  |
| Ctrl+B             | Bold                   |
| Ctrl+I             | Italic                 |
| Ctrl+U             | Underline              |
| Ctrl+Z             | Undo                   |
| Ctrl+Y             | Redo                   |

## Recent Fixes

Current release highlights:
- Improved window drag handling for the tab bar area
- Enhanced print preview and formatted printing (Ctrl+P)
- Modular refactor: components separated for better maintainability

## Technologies

- Frontend: React 18 + Vite
- Editor: TipTap (based on ProseMirror)
- Desktop: Tauri 2.0
- Markdown: markdown-it, turndown
- Export: html2pdf.js, html-to-docx
- Styling: Custom CSS with CSS variables

## Development Notes

Window drag
- The `.tabs-bar` area no longer uses `app-region: drag` to allow interactive elements.
- Window dragging is handled by `.header` using `data-tauri-drag-region`.
- Interactive elements use `app-region: no-drag`.

Tab state
- Automatic persistence to localStorage
- Visual indicator for unsaved changes
- Duplicate prevention when opening documents

## License

Licensed under the Prosperity Public License — free for non‑commercial use.







