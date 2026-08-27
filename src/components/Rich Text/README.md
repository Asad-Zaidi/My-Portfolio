# Rich Text Component for React

A lightweight, self-contained, and modular **Rich Text Editor & Viewer** package with full formatting capabilities, XSS sanitization, MS Word/Docs paste cleaning, and clean responsive prose styling.

---

## 📁 Folder Structure

```text
Rich Text/
├── components/
│   ├── RichTextEditor.jsx    # Feature-complete WYSIWYG editor component
│   ├── RichTextViewer.jsx    # Safe HTML viewer with prose typography styling
│   └── ToolbarButton.jsx     # Reusable toolbar button component
├── utils/
│   └── sanitizeHtml.js       # Sanitizer, XSS blocker, MS Word paste cleaner, text extraction
├── styles/
│   ├── rich-text.css         # Self-contained editor, toolbar & modal CSS
│   └── typography.css        # Typography formatting (.prose-theme) for rendered HTML
├── index.js                  # Main entry point (re-exports components & utilities)
├── package.json              # Peer dependencies guide
└── README.md                 # Documentation and integration guide
```

---

## 🚀 How to Use in Your Other Project

### Step 1: Copy the Folder
Copy this entire `Rich Text/` folder into your project's component directory (e.g., `src/components/rich-text/`).

### Step 2: Install Required Dependencies
The component uses `react` and `react-icons`:
```bash
npm install react-icons
```

---

## 💻 Quick Start Examples

### 1. Rich Text Editor Example

```jsx
import React, { useState } from 'react';
import { RichTextEditor } from './components/rich-text';

export default function PostEditor() {
    const [content, setContent] = useState('<h2>Welcome to the Editor</h2><p>Start typing...</p>');

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                Article Content
            </label>
            <RichTextEditor
                value={content}
                onChange={(html) => setContent(html)}
                placeholder="Write your article or description..."
                minHeight="260px"
                showStats={true}
            />
        </div>
    );
}
```

---

### 2. Displaying Sanitized Rich Text (Viewer)

```jsx
import React from 'react';
import { RichTextViewer } from './components/rich-text';

export default function ArticleDetail({ post }) {
    return (
        <article className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            {/* Renders sanitized HTML safely with automatic typography styling */}
            <RichTextViewer content={post.content} />
        </article>
    );
}
```

---

### 3. Using Sanitizer & Utility Functions

```jsx
import { sanitizeHtml, stripHtml, isHtmlContent } from './components/rich-text';

// 1. Sanitize raw HTML string
const cleanHtml = sanitizeHtml('<script>alert("XSS")</script><p>Clean content</p>');
// Output: '<p>Clean content</p>'

// 2. Strip HTML tags for previews / meta descriptions / word count
const excerpt = stripHtml('<p>This is <strong>bold</strong> text.</p>');
// Output: 'This is bold text.'

// 3. Test if string contains HTML
const hasHtml = isHtmlContent('<p>Sample</p>'); // true
```

---

## ⚙️ Props Reference

### `<RichTextEditor />`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | The HTML content string. |
| `onChange` | `(html: string) => void` | `undefined` | Callback invoked when editor content changes. |
| `placeholder` | `string` | `'Write your content here...'` | Placeholder displayed when the editor is empty. |
| `disabled` | `boolean` | `false` | Read-only mode when `true`. |
| `minHeight` | `string` | `'220px'` | Minimum height of editor surface. |
| `showStats` | `boolean` | `false` | Displays word & character counts in the footer. |
| `onImageUpload` | `(file: File) => Promise<string>` | `null` | Optional custom image upload function returning an image URL. If omitted, converts image to Base64 Data URL automatically. |
| `toast` | `object \| function` | `null` | Optional toast notification instance (e.g. `react-toastify`). |
| `className` | `string` | `''` | Extra CSS class for the outer container. |

---

### `<RichTextViewer />`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `content` | `string` | `''` | The raw or sanitized HTML content to display. |
| `sanitize` | `boolean` | `true` | When `true`, automatically strips scripts, inline JS handlers, and disallowed tags before rendering. |
| `fallback` | `string` | `''` | Text displayed when content is empty. |
| `className` | `string` | `''` | Extra CSS class names. |
| `style` | `object` | `{}` | Inline CSS styling. |

---

## 🖼️ Custom Image Upload Handler (Optional)

If your backend has an upload API endpoint (like Cloudinary, S3, or Multer):

```jsx
const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    return data.url; // Return the hosted image URL string
};

<RichTextEditor
    value={content}
    onChange={setContent}
    onImageUpload={handleImageUpload}
/>
```

---

## ✨ Features Included
- **History**: Undo (`Ctrl+Z`), Redo (`Ctrl+Y`)
- **Block Formats**: Paragraph, Headings (H1 to H6), Blockquote, Code Block
- **Fonts**: Font Family & Font Size dropdowns
- **Inline Styles**: Bold, Italic, Underline, Strikethrough, Subscript ($x_2$), Superscript ($x^2$)
- **Colors**: Text Color Picker & Background Highlight Picker with quick swatches
- **Alignment**: Align Left, Center, Right, Justify
- **Lists & Indent**: Bullet List, Numbered List, Increase Indent
- **Insert Elements**:
  - 🔗 Hyperlink Modal (URL, display text, open in new tab)
  - 🖼️ Image Modal (File upload with progress or direct image URL)
  - 📊 Table Generator Modal (Custom rows & columns)
  - ➖ Horizontal Divider
- **HTML Source Toggle**: One-click switch between visual WYSIWYG editor and raw HTML source code.
- **Smart Paste**: Automatic cleaning of Microsoft Word and Google Docs clipboard artifacts.
- **XSS Protection**: Built-in sanitization stripping unsafe scripts and malicious tags.
