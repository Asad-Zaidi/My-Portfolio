/**
 * Rich Text Component Package
 * Self-contained rich text editor, sanitized viewer, and HTML processing utilities.
 */

export { RichTextEditor, default as RichTextEditorDefault } from './components/RichTextEditor';
export { RichTextViewer, default as RichTextViewerDefault } from './components/RichTextViewer';
export { ToolbarButton } from './components/ToolbarButton';
export {
    sanitizeHtml,
    cleanWordHtml,
    isHtmlContent,
    stripHtml,
    ALLOWED_TAGS,
    ALLOWED_ATTRS
} from './utils/sanitizeHtml';

import './styles/rich-text.css';
