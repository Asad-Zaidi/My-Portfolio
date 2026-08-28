/**
 * Rich Text Component Package
 * Self-contained rich text editor, sanitized viewer, and HTML processing utilities.
 */

import './styles/rich-text.css';

export { RichTextEditor, default as RichTextEditorDefault } from './components/RichTextEditor';
export { RichTextViewer, default as RichTextViewerDefault } from './components/RichTextViewer';
export { ImageCropModal, default as ImageCropModalDefault } from './components/ImageCropModal';
export { ToolbarButton } from './components/ToolbarButton';
export {
    sanitizeHtml,
    cleanWordHtml,
    isRtlText,
    isHtmlContent,
    stripHtml,
    ALLOWED_TAGS,
    ALLOWED_ATTRS
} from './utils/sanitizeHtml';
