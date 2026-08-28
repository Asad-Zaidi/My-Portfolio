import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter,
    FiAlignRight, FiAlignJustify, FiList, FiLink, FiImage, FiGrid,
    FiRotateCcw, FiRotateCw, FiCode, FiMinus, FiCornerDownLeft,
    FiX, FiDroplet, FiSlash, FiMaximize2, FiMinimize2, FiSave, FiFileText, FiPlus,
    FiTrash2, FiSquare, FiChevronDown, FiLayout, FiCrop, FiSliders,
    FiLock, FiUnlock, FiLayers, FiCircle, FiRefreshCw, FiEdit3
} from 'react-icons/fi';
import { ToolbarButton } from './ToolbarButton';
import DropDown from '../../DropDown';
import { sanitizeHtml, cleanWordHtml, isRtlText, stripHtml } from '../utils/sanitizeHtml';
import ImageCropModal from './ImageCropModal';
import '../styles/rich-text.css';

const DEFAULT_FONT_FAMILIES = [
    { label: 'Default', name: 'Default', value: 'inherit' },
    { label: 'Jameel Noori Nastaleeq', name: 'Jameel Noori Nastaleeq', value: "'Jameel Noori Nastaleeq', sans-serif" },
    { label: 'Jameel Noori Kasheeda', name: 'Jameel Noori Kasheeda', value: "'Jameel Noori Kasheeda', sans-serif" },
    { label: 'Google Sans', name: 'Google Sans', value: "'Google Sans', sans-serif" },
    { label: 'Inter', name: 'Inter', value: "'Inter', sans-serif" },
    { label: 'Arial', name: 'Arial', value: "Arial, Helvetica, sans-serif" },
    { label: 'Georgia', name: 'Georgia', value: "Georgia, serif" },
    { label: 'Monospace', name: 'Monospace', value: 'ui-monospace, monospace' },
];

const FONT_SIZE_STEPS = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

const FORMAT_BLOCK_OPTIONS = [
    { label: 'Paragraph', value: 'p' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
    { label: 'Heading 6', value: 'h6' },
    { label: 'Blockquote', value: 'blockquote' },
    { label: 'Code Block', value: 'pre' },
];

const LINE_SPACING_OPTIONS = [
    { label: 'Line: Auto', name: 'Line: Auto', value: 'default' },
    { label: 'Line: 1.0 (Single)', name: 'Line: 1.0 (Single)', value: '1' },
    { label: 'Line: 1.15 (Tight)', name: 'Line: 1.15 (Tight)', value: '1.15' },
    { label: 'Line: 1.5 (Normal)', name: 'Line: 1.5 (Normal)', value: '1.5' },
    { label: 'Line: 1.75 (Spacious)', name: 'Line: 1.75 (Spacious)', value: '1.75' },
    { label: 'Line: 2.0 (Double)', name: 'Line: 2.0 (Double)', value: '2' },
    { label: 'Line: 2.2 (Nastaleeq)', name: 'Line: 2.2 (Nastaleeq)', value: '2.2' },
    { label: 'Line: 2.5 (Loose)', name: 'Line: 2.5 (Loose)', value: '2.5' },
    { label: 'Line: 3.0 (Triple)', name: 'Line: 3.0 (Triple)', value: '3' },
];

const WORD_SPACING_OPTIONS = [
    { label: 'Word: Compact (-2px)', name: 'Word: Compact (-2px)', value: '-2px' },
    { label: 'Word: Tight (-1px)', name: 'Word: Tight (-1px)', value: '-1px' },
    { label: 'Word: Normal (0px)', name: 'Word: Normal (0px)', value: 'normal' },
    { label: 'Word: Relaxed (+2px)', name: 'Word: Relaxed (+2px)', value: '2px' },
    { label: 'Word: Wide (+4px)', name: 'Word: Wide (+4px)', value: '4px' },
    { label: 'Word: Loose (+8px)', name: 'Word: Loose (+8px)', value: '8px' },
];

const COLOR_SWATCHES = [
    '#12131A', '#2F6FED', '#F5A524', '#10B981', '#E5484D',
    '#7C3AED', '#EC4899', '#3B82F6', '#64748B', '#000000',
    '#FFFFFF', '#F1F5F9', '#CBD5E1', '#94A3B8', '#475569'
];

const TABLE_PRESETS = [
    { label: 'Modern Clean', name: 'Modern Clean', value: 'clean' },
    { label: 'Zebra Striped', name: 'Zebra Striped', value: 'zebra' },
    { label: 'Accent Blue Header', name: 'Accent Blue Header', value: 'accent' },
    { label: 'Dark Slate Header', name: 'Dark Slate Header', value: 'dark' },
];

const TABLE_BORDER_COLORS = [
    '#cbd5e1', '#94a3b8', '#64748b', '#334155', '#0f172a',
    '#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#e2e8f0', '#000000'
];

const TABLE_BG_COLORS = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#dbeafe',
    '#eff6ff', '#f0fdf4', '#fef3c7', '#fee2e2', '#f3e8ff',
    '#fce7f3', '#ecfeff', '#1e293b', '#0f172a', '#2563eb'
];

// MS Word Image Formatting Constants
const IMAGE_WRAP_OPTIONS = [
    { label: 'Inline with Text', name: 'Inline with Text', value: 'inline' },
    { label: 'Wrap Left (Square)', name: 'Wrap Left (Square)', value: 'wrap-left' },
    { label: 'Wrap Right (Square)', name: 'Wrap Right (Square)', value: 'wrap-right' },
    { label: 'Break Text (Center)', name: 'Break Text (Center)', value: 'break-center' },
    { label: 'Break Text (Left)', name: 'Break Text (Left)', value: 'break-left' },
    { label: 'Break Text (Right)', name: 'Break Text (Right)', value: 'break-right' },
];

const IMAGE_SIZE_PRESETS = [
    { label: '25% Width', name: '25% Width', value: '25%' },
    { label: '50% Width', name: '50% Width', value: '50%' },
    { label: '75% Width', name: '75% Width', value: '75%' },
    { label: '100% Full Width', name: '100% Full Width', value: '100%' },
    { label: '200px Small', name: '200px Small', value: '200px' },
    { label: '400px Medium', name: '400px Medium', value: '400px' },
    { label: '600px Large', name: '600px Large', value: '600px' },
    { label: 'Auto (Original)', name: 'Auto (Original)', value: 'auto' },
];

const IMAGE_BORDER_STYLES = [
    { label: 'None', name: 'None', value: 'none' },
    { label: 'Solid Line', name: 'Solid Line', value: 'solid' },
    { label: 'Dashed', name: 'Dashed', value: 'dashed' },
    { label: 'Dotted', name: 'Dotted', value: 'dotted' },
    { label: 'Double', name: 'Double', value: 'double' },
];

const IMAGE_BORDER_WIDTHS = [
    { label: '1px', name: '1px', value: '1px' },
    { label: '2px', name: '2px', value: '2px' },
    { label: '3px', name: '3px', value: '3px' },
    { label: '4px', name: '4px', value: '4px' },
    { label: '6px', name: '6px', value: '6px' },
];

const IMAGE_RADIUS_OPTIONS = [
    { label: 'Sharp (0px)', name: 'Sharp (0px)', value: '0px' },
    { label: 'Subtle (8px)', name: 'Subtle (8px)', value: '8px' },
    { label: 'Rounded (16px)', name: 'Rounded (16px)', value: '16px' },
    { label: 'Card (24px)', name: 'Card (24px)', value: '24px' },
    { label: 'Circle / Pill', name: 'Circle / Pill', value: '9999px' },
];

const IMAGE_SHADOW_OPTIONS = [
    { label: 'No Shadow', name: 'No Shadow', value: 'none' },
    { label: 'Soft Shadow', name: 'Soft Shadow', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
    { label: 'Card Elevation', name: 'Card Elevation', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
    { label: 'Deep Shadow', name: 'Deep Shadow', value: '0 20px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.2)' },
    { label: 'Accent Glow', name: 'Accent Glow', value: '0 0 20px rgba(47, 111, 237, 0.4)' },
];

const IMAGE_FILTER_OPTIONS = [
    { label: 'Original', name: 'Original', value: 'none' },
    { label: 'Grayscale', name: 'Grayscale', value: 'grayscale(100%)' },
    { label: 'Sepia Vintage', name: 'Sepia Vintage', value: 'sepia(80%)' },
    { label: 'Warm Glow', name: 'Warm Glow', value: 'sepia(30%) saturate(140%)' },
    { label: 'High Contrast', name: 'High Contrast', value: 'contrast(130%)' },
    { label: 'Cool Bright', name: 'Cool Bright', value: 'brightness(110%) saturate(120%)' },
];

/**
 * RichTextEditor Component
 *
 * @param {Object} props
 * @param {string} props.value - HTML string value
 * @param {Function} props.onChange - Callback fired when HTML content changes: (html: string) => void
 * @param {string} [props.placeholder='Write your content here...'] - Placeholder text
 * @param {boolean} [props.disabled=false] - Whether the editor is read-only
 * @param {string} [props.minHeight='220px'] - Minimum height of the editor area
 * @param {string} [props.className=''] - Additional container CSS classes
 * @param {boolean} [props.showStats=false] - Whether to show word & character count in footer
 * @param {Array} [props.fontFamilies] - Custom list of font families [{ label, value }]
 * @param {string} [props.documentTitle='Document Editor'] - Document title shown in full screen mode
 * @param {Function} [props.onSave] - Optional save handler triggered by top right Save button in full screen
 * @param {boolean} [props.allowFullScreen=true] - Whether to enable full-screen Google Docs / MS Word mode
 * @param {Function} [props.onImageUpload] - Custom async image upload handler: async (file: File) => Promise<string>
 * @param {Function|Object} [props.toast] - Optional toast notifier (e.g. react-toastify or custom { success, error })
 */
export const RichTextEditor = ({
    value = '',
    onChange,
    placeholder = 'Write your content here...',
    disabled = false,
    minHeight = '220px',
    className = '',
    showStats = false,
    fontFamilies = DEFAULT_FONT_FAMILIES,
    documentTitle = 'Document Editor',
    onSave = null,
    allowFullScreen = true,
    onImageUpload = null,
    toast = null
}) => {
    const editorRef = useRef(null);
    const editorWrapperRef = useRef(null);
    const [showSource, setShowSource] = useState(false);
    const [sourceValue, setSourceValue] = useState(value || '');
    const [activeFormats, setActiveFormats] = useState({});
    const [selectedBlock, setSelectedBlock] = useState('p');
    const [selectedFont, setSelectedFont] = useState('inherit');
    const [fontSizePx, setFontSizePx] = useState(16);
    const [selectedLineSpacing, setSelectedLineSpacing] = useState('default');
    const [selectedWordSpacing, setSelectedWordSpacing] = useState('normal');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [saving, setSaving] = useState(false);
    const isInternalChange = useRef(false);
    const savedRangeRef = useRef(null);

    // Notification handler
    // Notification handler
    const notify = useCallback((type, message) => {
        if (toast && typeof toast[type] === 'function') {
            toast[type](message);
        } else if (typeof toast === 'function') {
            toast(type, message);
        } else if (type === 'error') {
            console.warn(`[RichTextEditor]: ${message}`);
        }
    }, [toast]);

    const handleTopSave = useCallback(async () => {
        if (typeof onSave !== 'function') return;
        setSaving(true);
        try {
            await onSave();
            notify('success', 'Document saved successfully.');
        } catch (err) {
            notify('error', err?.message || 'Failed to save document.');
        } finally {
            setSaving(false);
        }
    }, [onSave, notify]);

    // Keep state synchronized with external prop
    useEffect(() => {
        if (editorRef.current && !isInternalChange.current) {
            const currentHtml = editorRef.current.innerHTML;
            if (currentHtml !== value) {
                editorRef.current.innerHTML = value || '';
            }
        }
        setSourceValue(value || '');
        isInternalChange.current = false;
    }, [value]);

    const updateContent = useCallback(() => {
        if (!editorRef.current) return;
        const rawHtml = editorRef.current.innerHTML;
        const clean = sanitizeHtml(rawHtml);
        isInternalChange.current = true;
        setSourceValue(clean);
        if (onChange) onChange(clean);
    }, [onChange]);

    // Intelligent Clipboard Paste Handler with Automatic RTL/LTR Detection
    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        const html = clipboardData.getData('text/html');
        const plainText = clipboardData.getData('text/plain');

        if (html) {
            let cleaned = cleanWordHtml(html);
            if (isRtlText(plainText || cleaned)) {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(cleaned, 'text/html');
                    const blocks = doc.body.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, blockquote');
                    if (blocks.length > 0) {
                        blocks.forEach((b) => {
                            if (!b.getAttribute('dir') && isRtlText(b.textContent)) {
                                b.setAttribute('dir', 'auto');
                            }
                        });
                        cleaned = doc.body.innerHTML;
                    } else {
                        cleaned = `<p dir="auto">${cleaned}</p>`;
                    }
                } catch (err) {
                    cleaned = `<p dir="auto">${cleaned}</p>`;
                }
            }
            document.execCommand('insertHTML', false, cleaned);
        } else if (plainText) {
            const hasRtl = isRtlText(plainText);
            const lines = plainText.split(/\r?\n\r?\n/);
            if (lines.length > 1) {
                const htmlBlocks = lines
                    .map((line) => {
                        const trimmed = line.trim();
                        if (!trimmed) return '';
                        const lineRtl = isRtlText(trimmed);
                        const formatted = trimmed.replace(/\n/g, '<br/>');
                        return `<p ${lineRtl ? 'dir="auto"' : ''}>${formatted}</p>`;
                    })
                    .filter(Boolean)
                    .join('');
                document.execCommand('insertHTML', false, htmlBlocks);
            } else {
                const trimmed = plainText.trim();
                if (hasRtl) {
                    const formatted = trimmed.replace(/\n/g, '<br/>');
                    document.execCommand('insertHTML', false, `<p dir="auto">${formatted}</p>`);
                } else {
                    document.execCommand('insertText', false, plainText);
                }
            }
        }

        updateContent();
    }, [updateContent]);

    // Text Direction (LTR / RTL / Auto) setter for blocks
    const setTextDirection = useCallback((dir) => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        let node = sel.anchorNode;
        while (node && node !== editorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE && /^(P|H[1-6]|DIV|LI|BLOCKQUOTE)$/i.test(node.tagName)) {
                if (dir === 'auto') {
                    node.setAttribute('dir', 'auto');
                    node.style.textAlign = '';
                } else {
                    node.setAttribute('dir', dir);
                    node.style.textAlign = dir === 'rtl' ? 'right' : 'left';
                }
                updateContent();
                return;
            }
            node = node.parentNode;
        }

        if (editorRef.current) {
            document.execCommand('formatBlock', false, 'p');
            const updatedSel = window.getSelection();
            let target = updatedSel?.anchorNode;
            while (target && target !== editorRef.current) {
                if (target.nodeType === Node.ELEMENT_NODE && /^(P|H[1-6]|DIV|LI|BLOCKQUOTE)$/i.test(target.tagName)) {
                    target.setAttribute('dir', dir);
                    if (dir === 'rtl') target.style.textAlign = 'right';
                    else if (dir === 'ltr') target.style.textAlign = 'left';
                    updateContent();
                    return;
                }
                target = target.parentNode;
            }
        }
    }, [updateContent]);

    // Line Spacing handler
    const handleLineSpacing = useCallback((val) => {
        setSelectedLineSpacing(val);
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        let node = sel.anchorNode;
        while (node && node !== editorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE && /^(P|H[1-6]|DIV|LI|BLOCKQUOTE|TABLE)$/i.test(node.tagName)) {
                node.style.lineHeight = val === 'default' ? '' : val;
                updateContent();
                return;
            }
            node = node.parentNode;
        }

        if (editorRef.current) {
            document.execCommand('formatBlock', false, 'p');
            const updatedSel = window.getSelection();
            let target = updatedSel?.anchorNode;
            while (target && target !== editorRef.current) {
                if (target.nodeType === Node.ELEMENT_NODE && /^(P|H[1-6]|DIV|LI|BLOCKQUOTE)$/i.test(target.tagName)) {
                    target.style.lineHeight = val === 'default' ? '' : val;
                    updateContent();
                    return;
                }
                target = target.parentNode;
            }
        }
    }, [updateContent]);

    // Word Spacing handler
    const handleWordSpacing = useCallback((val) => {
        setSelectedWordSpacing(val);
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        let node = sel.anchorNode;
        while (node && node !== editorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE && /^(P|H[1-6]|DIV|LI|BLOCKQUOTE|SPAN)$/i.test(node.tagName)) {
                node.style.wordSpacing = val === 'normal' ? '' : val;
                updateContent();
                return;
            }
            node = node.parentNode;
        }

        if (editorRef.current) {
            document.execCommand('formatBlock', false, 'p');
            const updatedSel = window.getSelection();
            let target = updatedSel?.anchorNode;
            while (target && target !== editorRef.current) {
                if (target.nodeType === Node.ELEMENT_NODE && /^(P|H[1-6]|DIV|LI|BLOCKQUOTE)$/i.test(target.tagName)) {
                    target.style.wordSpacing = val === 'normal' ? '' : val;
                    updateContent();
                    return;
                }
                target = target.parentNode;
            }
        }
    }, [updateContent]);

    const checkActiveFormats = useCallback(() => {
        if (!editorRef.current) return;
        const sel = window.getSelection();
        let inTable = false;
        if (sel && sel.rangeCount > 0) {
            let node = sel.getRangeAt(0).commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode;
            inTable = Boolean(node && node.closest('table'));
        }
        setIsInTable(inTable);

        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikeThrough: document.queryCommandState('strikeThrough'),
            subscript: document.queryCommandState('subscript'),
            superscript: document.queryCommandState('superscript'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            insertOrderedList: document.queryCommandState('insertOrderedList'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            justifyFull: document.queryCommandState('justifyFull'),
        });
    }, []);

    // Execute standard formatting commands
    const exec = useCallback((command, val = null) => {
        if (disabled) return;
        document.execCommand(command, false, val);
        if (editorRef.current) editorRef.current.focus();
        updateContent();
        checkActiveFormats();
    }, [disabled, updateContent, checkActiveFormats]);

    // Format Block (Headings, Paragraph, Blockquote, Pre)
    const handleFormatBlock = useCallback((val) => {
        setSelectedBlock(val);
        if (val === 'p' || val === 'h1' || val === 'h2' || val === 'h3' || val === 'h4' || val === 'h5' || val === 'h6' || val === 'pre' || val === 'blockquote') {
            exec('formatBlock', `<${val}>`);
        } else if (val === 'code') {
            document.execCommand('insertHTML', false, `<code>${window.getSelection()?.toString() || 'code'}</code>`);
            updateContent();
        }
    }, [exec, updateContent]);

    // Font size custom functions (modifies font-size in-place without nesting spans or adding extra vertical space)
    const applyFontSize = useCallback((size) => {
        const num = Math.max(6, Math.min(144, parseInt(size, 10) || 16));
        setFontSizePx(num);

        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
            return;
        }

        const range = sel.getRangeAt(0);

        // Find if selection is already inside an existing font-size span
        let parent = range.commonAncestorContainer;
        if (parent.nodeType === 3) parent = parent.parentNode;

        let fontSpan = null;
        let curr = parent;
        while (curr && curr !== editorRef.current) {
            if (curr.tagName === 'SPAN' && curr.style && curr.style.fontSize) {
                fontSpan = curr;
                break;
            }
            curr = curr.parentNode;
        }

        // If selection is already inside a font-size span, mutate in-place!
        if (fontSpan && (fontSpan.textContent === range.toString() || range.toString().trim() === fontSpan.textContent.trim())) {
            fontSpan.style.fontSize = `${num}px`;
            fontSpan.style.lineHeight = 'normal';

            // Strip any inner nested font size declarations
            fontSpan.querySelectorAll('[style*="font-size"]').forEach((child) => {
                if (child !== fontSpan) {
                    child.style.fontSize = '';
                    child.style.lineHeight = '';
                }
            });

            // Re-select the span contents
            const newRange = document.createRange();
            newRange.selectNodeContents(fontSpan);
            sel.removeAllRanges();
            sel.addRange(newRange);
        } else {
            // Otherwise extract selection, strip nested font-size styles, and wrap in a clean span
            const fragment = range.extractContents();

            const temp = document.createElement('div');
            temp.appendChild(fragment);
            temp.querySelectorAll('[style*="font-size"]').forEach((el) => {
                el.style.fontSize = '';
                el.style.lineHeight = '';
                if (el.tagName === 'SPAN' && (!el.getAttribute('style') || el.getAttribute('style').trim() === '')) {
                    const p = el.parentNode;
                    while (el.firstChild) p.insertBefore(el.firstChild, el);
                    p.removeChild(el);
                }
            });

            const span = document.createElement('span');
            span.style.fontSize = `${num}px`;
            span.style.lineHeight = 'normal';
            while (temp.firstChild) {
                span.appendChild(temp.firstChild);
            }

            range.insertNode(span);

            // Re-select the span contents
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(newRange);
        }

        if (editorRef.current) {
            const rawHtml = editorRef.current.innerHTML;
            const clean = sanitizeHtml(rawHtml);
            isInternalChange.current = true;
            setSourceValue(clean);
            if (onChange) onChange(clean);
        }
    }, [onChange]);

    const increaseFontSize = useCallback(() => {
        const next = FONT_SIZE_STEPS.find(s => s > fontSizePx) || Math.min(144, fontSizePx + 2);
        applyFontSize(next);
    }, [fontSizePx, applyFontSize]);

    const decreaseFontSize = useCallback(() => {
        const reversed = [...FONT_SIZE_STEPS].reverse();
        const prev = reversed.find(s => s < fontSizePx) || Math.max(6, fontSizePx - 2);
        applyFontSize(prev);
    }, [fontSizePx, applyFontSize]);

    // Selection helpers to preserve cursor position when opening modals
    const saveSelection = useCallback(() => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRangeRef.current = sel.getRangeAt(0);
        }
    }, []);

    const restoreSelection = useCallback(() => {
        if (editorRef.current) {
            editorRef.current.focus();
            const sel = window.getSelection();
            if (savedRangeRef.current && sel) {
                try {
                    sel.removeAllRanges();
                    sel.addRange(savedRangeRef.current);
                } catch {
                    // Fallback to focusing editor
                }
            }
        }
    }, []);

    // Full MS Word & Google Docs Keyboard Shortcuts Handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isEditorActive = editorRef.current && (
                document.activeElement === editorRef.current ||
                editorRef.current.contains(document.activeElement) ||
                isFullScreen
            );

            if (!isEditorActive) return;

            // Fullscreen Escape
            if (isFullScreen && e.key === 'Escape') {
                e.preventDefault();
                setIsFullScreen(false);
                return;
            }

            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;
            const isAlt = e.altKey;
            const key = e.key ? e.key.toLowerCase() : '';

            // 1. Save (Ctrl+S)
            if (isCtrl && !isShift && !isAlt && key === 's') {
                e.preventDefault();
                if (typeof onSave === 'function') {
                    handleTopSave();
                }
                return;
            }

            // 2. Alignment shortcuts (MS Word: Ctrl+L, Ctrl+E, Ctrl+R, Ctrl+J)
            if (isCtrl && !isShift && !isAlt) {
                if (key === 'l') {
                    e.preventDefault();
                    exec('justifyLeft');
                    return;
                }
                if (key === 'e') {
                    e.preventDefault();
                    exec('justifyCenter');
                    return;
                }
                if (key === 'r') {
                    e.preventDefault();
                    exec('justifyRight');
                    return;
                }
                if (key === 'j') {
                    e.preventDefault();
                    exec('justifyFull');
                    return;
                }
            }

            // 3. Font Size: Ctrl+Shift+> / <
            if (isCtrl && isShift && !isAlt) {
                if (e.key === '>' || e.key === '.' || e.code === 'Period') {
                    e.preventDefault();
                    increaseFontSize();
                    return;
                }
                if (e.key === '<' || e.key === ',' || e.code === 'Comma') {
                    e.preventDefault();
                    decreaseFontSize();
                    return;
                }
            }

            // 4. Strikethrough (Ctrl+Shift+X or Ctrl+5)
            if ((isCtrl && isShift && key === 'x') || (isCtrl && !isShift && !isAlt && (key === '5' || e.code === 'Digit5'))) {
                e.preventDefault();
                exec('strikeThrough');
                return;
            }

            // 5. Subscript (Ctrl+=) & Superscript (Ctrl+Shift+= or Ctrl+Shift++)
            if (isCtrl && !isShift && !isAlt && (e.key === '=' || e.code === 'Equal')) {
                e.preventDefault();
                exec('subscript');
                return;
            }
            if (isCtrl && isShift && !isAlt && (e.key === '+' || e.key === '=' || e.code === 'Equal')) {
                e.preventDefault();
                exec('superscript');
                return;
            }

            // 6. Clear formatting (Ctrl+\ or Ctrl+Space)
            if (isCtrl && !isShift && !isAlt && (e.key === '\\' || e.code === 'Backslash' || e.key === ' ' || e.code === 'Space')) {
                e.preventDefault();
                exec('removeFormat');
                return;
            }

            // 7. Lists & Indentation
            // Bullet list (Ctrl+Shift+L or Ctrl+Shift+8)
            if (isCtrl && isShift && !isAlt && (key === 'l' || key === '8' || key === '7')) {
                e.preventDefault();
                exec('insertUnorderedList');
                return;
            }
            // Numbered list (Ctrl+Shift+O or Ctrl+Shift+9)
            if (isCtrl && isShift && !isAlt && (key === 'o' || key === '9')) {
                e.preventDefault();
                exec('insertOrderedList');
                return;
            }
            // Indent / Outdent (Ctrl+] / Ctrl+[ or Tab / Shift+Tab)
            if (isCtrl && !isShift && !isAlt && (e.key === ']' || e.code === 'BracketRight')) {
                e.preventDefault();
                exec('indent');
                return;
            }
            if (isCtrl && !isShift && !isAlt && (e.key === '[' || e.code === 'BracketLeft')) {
                e.preventDefault();
                exec('outdent');
                return;
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                if (isShift) {
                    exec('outdent');
                } else {
                    exec('indent');
                }
                return;
            }

            // 8. Paragraph & Headings (Ctrl+Alt+0..6)
            if (isCtrl && isAlt && !isShift) {
                if (key === '0' || e.code === 'Digit0') {
                    e.preventDefault();
                    handleFormatBlock('p');
                    return;
                }
                if (key === '1' || e.code === 'Digit1') {
                    e.preventDefault();
                    handleFormatBlock('h1');
                    return;
                }
                if (key === '2' || e.code === 'Digit2') {
                    e.preventDefault();
                    handleFormatBlock('h2');
                    return;
                }
                if (key === '3' || e.code === 'Digit3') {
                    e.preventDefault();
                    handleFormatBlock('h3');
                    return;
                }
                if (key === '4' || e.code === 'Digit4') {
                    e.preventDefault();
                    handleFormatBlock('h4');
                    return;
                }
                if (key === '5' || e.code === 'Digit5') {
                    e.preventDefault();
                    handleFormatBlock('h5');
                    return;
                }
                if (key === '6' || e.code === 'Digit6') {
                    e.preventDefault();
                    handleFormatBlock('h6');
                    return;
                }
            }

            // Blockquote (Ctrl+Shift+Q)
            if (isCtrl && isShift && !isAlt && key === 'q') {
                e.preventDefault();
                handleFormatBlock('blockquote');
                return;
            }

            // Code (Ctrl+Shift+C or Ctrl+`)
            if ((isCtrl && isShift && !isAlt && key === 'c') || (isCtrl && !isShift && !isAlt && (e.key === '`' || e.code === 'Backquote'))) {
                e.preventDefault();
                handleFormatBlock('code');
                return;
            }

            // 9. Modals & Insertions
            // Link (Ctrl+K)
            if (isCtrl && !isShift && !isAlt && key === 'k') {
                e.preventDefault();
                saveSelection();
                const selText = window.getSelection()?.toString();
                setLinkText(selText || '');
                setLinkModalOpen(true);
                return;
            }

            // Image (Ctrl+Shift+I)
            if (isCtrl && isShift && !isAlt && key === 'i') {
                e.preventDefault();
                saveSelection();
                setImageModalOpen(true);
                return;
            }

            // Table (Ctrl+Shift+T)
            if (isCtrl && isShift && !isAlt && key === 't') {
                e.preventDefault();
                saveSelection();
                setTableModalOpen(true);
                return;
            }

            // Horizontal Line (Ctrl+Enter)
            if (isCtrl && !isShift && !isAlt && e.key === 'Enter') {
                e.preventDefault();
                exec('insertHorizontalRule');
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullScreen, onSave, handleTopSave, exec, handleFormatBlock, increaseFontSize, decreaseFontSize, saveSelection]);

    // Modal state
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [linkTargetBlank, setLinkTargetBlank] = useState(true);

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [hoverRows, setHoverRows] = useState(0);
    const [hoverCols, setHoverCols] = useState(0);
    const [showCustomTableInputs, setShowCustomTableInputs] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [includeHeader, setIncludeHeader] = useState(true);

    // Table Design Contextual Ribbon State
    const [isInTable, setIsInTable] = useState(false);
    const [tableDesignOpen, setTableDesignOpen] = useState(false);
    const [selectedTablePreset, setSelectedTablePreset] = useState('clean');
    const [tableBorderColorPickerOpen, setTableBorderColorPickerOpen] = useState(false);
    const [tableBgColorPickerOpen, setTableBgColorPickerOpen] = useState(false);
    const [tableTextColorPickerOpen, setTableTextColorPickerOpen] = useState(false);

    const [textColorPickerOpen, setTextColorPickerOpen] = useState(false);
    const [bgColorPickerOpen, setBgColorPickerOpen] = useState(false);

    // Image Formatting & Interactive Selection State
    const [selectedImgEl, setSelectedImgEl] = useState(null);
    const [imgOverlayRect, setImgOverlayRect] = useState(null);
    const [imageToolsOpen, setImageToolsOpen] = useState(false);
    const [imgWrap, setImgWrap] = useState('break-center');
    const [imgWidthInput, setImgWidthInput] = useState('');
    const [imgHeightInput, setImgHeightInput] = useState('');
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [imgBorderColorPickerOpen, setImgBorderColorPickerOpen] = useState(false);
    const [imgBorderThickness, setImgBorderThickness] = useState('2px');
    const [imgBorderStyle, setImgBorderStyle] = useState('none');
    const [imgBorderColor, setImgBorderColor] = useState('#cbd5e1');
    const [imgEffectsPickerOpen, setImgEffectsPickerOpen] = useState(false);
    const [imgRadius, setImgRadius] = useState('16px');
    const [imgShadow, setImgShadow] = useState('none');
    const [imgFilter, setImgFilter] = useState('none');
    const [imgCropModalOpen, setImgCropModalOpen] = useState(false);
    const [imgAltModalOpen, setImgAltModalOpen] = useState(false);
    const [imgAltText, setImgAltText] = useState('');
    const [imgTitleText, setImgTitleText] = useState('');

    const handleFontName = (val) => {
        setSelectedFont(val);
        exec('fontName', val);
    };

    // Overlay position calculation relative to editor container
    const updateImgOverlayRect = useCallback(() => {
        if (!selectedImgEl || !editorRef.current || !editorWrapperRef.current) {
            setImgOverlayRect(null);
            return;
        }
        if (!editorRef.current.contains(selectedImgEl)) {
            setSelectedImgEl(null);
            setImgOverlayRect(null);
            return;
        }
        const imgRect = selectedImgEl.getBoundingClientRect();
        const wrapperRect = editorWrapperRef.current.getBoundingClientRect();

        setImgOverlayRect({
            top: imgRect.top - wrapperRect.top,
            left: imgRect.left - wrapperRect.left,
            width: imgRect.width,
            height: imgRect.height,
        });
    }, [selectedImgEl]);

    // Read current image styling into state
    const syncImgStylesToState = useCallback((img) => {
        if (!img) return;
        const computed = window.getComputedStyle(img);
        const floatVal = img.style.float || computed.float;
        const displayVal = img.style.display || computed.display;
        const marginVal = img.style.margin;

        if (floatVal === 'left') {
            setImgWrap('wrap-left');
        } else if (floatVal === 'right') {
            setImgWrap('wrap-right');
        } else if (displayVal === 'inline-block' || displayVal === 'inline') {
            setImgWrap('inline');
        } else if (marginVal && (marginVal.includes('auto 16px 0') || marginVal.includes('auto auto 0'))) {
            setImgWrap('break-left');
        } else if (marginVal && marginVal.includes('0 16px auto')) {
            setImgWrap('break-right');
        } else {
            setImgWrap('break-center');
        }

        const rect = img.getBoundingClientRect();
        setImgWidthInput(img.style.width ? parseInt(img.style.width, 10) || '' : Math.round(rect.width));
        setImgHeightInput(img.style.height && img.style.height !== 'auto' ? parseInt(img.style.height, 10) || '' : Math.round(rect.height));
        setImgAltText(img.getAttribute('alt') || '');
        setImgTitleText(img.getAttribute('title') || '');
        setImgBorderStyle(img.style.borderStyle || 'none');
        setImgBorderThickness(img.style.borderWidth || '2px');
        setImgBorderColor(img.style.borderColor || '#cbd5e1');
        setImgRadius(img.style.borderRadius || '16px');
        setImgShadow(img.style.boxShadow || 'none');
        setImgFilter(img.style.filter || 'none');
    }, []);

    // Selection on click in editor surface
    const handleEditorClick = useCallback((e) => {
        const target = e.target;
        if (target && target.tagName === 'IMG') {
            if (editorRef.current) {
                editorRef.current.querySelectorAll('img').forEach(el => el.classList.remove('rte-selected-image'));
            }
            target.classList.add('rte-selected-image');
            setSelectedImgEl(target);
            syncImgStylesToState(target);
            setImageToolsOpen(true);
        } else {
            if (editorRef.current) {
                editorRef.current.querySelectorAll('img').forEach(el => el.classList.remove('rte-selected-image'));
            }
            setSelectedImgEl(null);
        }
    }, [syncImgStylesToState]);

    // Keep overlay in sync on window resize / scroll
    useEffect(() => {
        if (!selectedImgEl) return;
        updateImgOverlayRect();
        const handleScrollOrResize = () => updateImgOverlayRect();
        window.addEventListener('resize', handleScrollOrResize);
        const editorEl = editorRef.current;
        if (editorEl) editorEl.addEventListener('scroll', handleScrollOrResize);
        return () => {
            window.removeEventListener('resize', handleScrollOrResize);
            if (editorEl) editorEl.removeEventListener('scroll', handleScrollOrResize);
        };
    }, [selectedImgEl, updateImgOverlayRect]);

    // Apply Word-style text wrapping
    const applyImageWrap = useCallback((wrapType) => {
        if (!selectedImgEl) return;
        setImgWrap(wrapType);
        selectedImgEl.setAttribute('data-wrap', wrapType);

        if (wrapType === 'inline') {
            selectedImgEl.style.float = 'none';
            selectedImgEl.style.display = 'inline-block';
            selectedImgEl.style.margin = '0 8px';
            selectedImgEl.style.clear = 'none';
            selectedImgEl.style.verticalAlign = 'middle';
        } else if (wrapType === 'wrap-left') {
            selectedImgEl.style.float = 'left';
            selectedImgEl.style.display = 'block';
            selectedImgEl.style.margin = '8px 16px 8px 0';
            selectedImgEl.style.clear = 'none';
            selectedImgEl.style.verticalAlign = 'baseline';
        } else if (wrapType === 'wrap-right') {
            selectedImgEl.style.float = 'right';
            selectedImgEl.style.display = 'block';
            selectedImgEl.style.margin = '8px 0 8px 16px';
            selectedImgEl.style.clear = 'none';
            selectedImgEl.style.verticalAlign = 'baseline';
        } else if (wrapType === 'break-left') {
            selectedImgEl.style.float = 'none';
            selectedImgEl.style.display = 'block';
            selectedImgEl.style.margin = '16px auto 16px 0';
            selectedImgEl.style.clear = 'both';
        } else if (wrapType === 'break-right') {
            selectedImgEl.style.float = 'none';
            selectedImgEl.style.display = 'block';
            selectedImgEl.style.margin = '16px 0 16px auto';
            selectedImgEl.style.clear = 'both';
        } else {
            // break-center (default)
            selectedImgEl.style.float = 'none';
            selectedImgEl.style.display = 'block';
            selectedImgEl.style.margin = '16px auto';
            selectedImgEl.style.clear = 'both';
        }

        updateContent();
        updateImgOverlayRect();
        notify('success', `Applied ${wrapType} layout.`);
    }, [selectedImgEl, updateContent, updateImgOverlayRect, notify]);

    // Apply quick preset size
    const applyImagePresetSize = useCallback((size) => {
        if (!selectedImgEl) return;
        if (size === 'auto') {
            selectedImgEl.style.width = '';
            selectedImgEl.style.height = '';
            selectedImgEl.style.maxWidth = '100%';
        } else if (size.endsWith('%')) {
            selectedImgEl.style.width = size;
            selectedImgEl.style.height = 'auto';
            selectedImgEl.style.maxWidth = '100%';
        } else {
            selectedImgEl.style.width = size;
            selectedImgEl.style.height = 'auto';
        }
        const rect = selectedImgEl.getBoundingClientRect();
        setImgWidthInput(Math.round(rect.width));
        setImgHeightInput(Math.round(rect.height));
        updateContent();
        updateImgOverlayRect();
        notify('success', `Resized image to ${size}.`);
    }, [selectedImgEl, updateContent, updateImgOverlayRect, notify]);

    // Apply custom numerical width / height
    const applyImageDimension = useCallback((type, val) => {
        if (!selectedImgEl) return;
        const num = parseInt(val, 10);
        if (!num || num <= 0) return;

        const rect = selectedImgEl.getBoundingClientRect();
        const ratio = (selectedImgEl.naturalWidth && selectedImgEl.naturalHeight)
            ? selectedImgEl.naturalWidth / selectedImgEl.naturalHeight
            : rect.width / (rect.height || 1);

        if (type === 'width') {
            setImgWidthInput(num);
            selectedImgEl.style.width = `${num}px`;
            if (lockAspectRatio) {
                const newH = Math.round(num / ratio);
                selectedImgEl.style.height = 'auto';
                setImgHeightInput(newH);
            }
        } else {
            setImgHeightInput(num);
            selectedImgEl.style.height = `${num}px`;
            if (lockAspectRatio) {
                const newW = Math.round(num * ratio);
                selectedImgEl.style.width = `${newW}px`;
                setImgWidthInput(newW);
            }
        }
        updateContent();
        updateImgOverlayRect();
    }, [selectedImgEl, lockAspectRatio, updateContent, updateImgOverlayRect]);

    // Border formatting
    const applyImageBorder = useCallback((style = imgBorderStyle, width = imgBorderThickness, color = imgBorderColor) => {
        if (!selectedImgEl) return;
        setImgBorderStyle(style);
        setImgBorderThickness(width);
        setImgBorderColor(color);

        if (style === 'none') {
            selectedImgEl.style.border = 'none';
        } else {
            selectedImgEl.style.border = `${width} ${style} ${color}`;
        }
        updateContent();
        updateImgOverlayRect();
    }, [selectedImgEl, imgBorderStyle, imgBorderThickness, imgBorderColor, updateContent, updateImgOverlayRect]);

    // Corner radius
    const applyImageRadius = useCallback((radius) => {
        if (!selectedImgEl) return;
        setImgRadius(radius);
        selectedImgEl.style.borderRadius = radius;
        updateContent();
        updateImgOverlayRect();
        notify('success', 'Corner radius updated.');
    }, [selectedImgEl, updateContent, updateImgOverlayRect, notify]);

    // Shadow & Elevation
    const applyImageShadow = useCallback((shadow) => {
        if (!selectedImgEl) return;
        setImgShadow(shadow);
        selectedImgEl.style.boxShadow = shadow === 'none' ? 'none' : shadow;
        updateContent();
        updateImgOverlayRect();
        notify('success', 'Image shadow updated.');
    }, [selectedImgEl, updateContent, updateImgOverlayRect, notify]);

    // Picture Filter
    const applyImageFilter = useCallback((filter) => {
        if (!selectedImgEl) return;
        setImgFilter(filter);
        selectedImgEl.style.filter = filter === 'none' ? 'none' : filter;
        updateContent();
        updateImgOverlayRect();
        notify('success', 'Image filter applied.');
    }, [selectedImgEl, updateContent, updateImgOverlayRect, notify]);

    // Alt text & Title
    const applyImageAltAndTitle = useCallback((alt, title) => {
        if (!selectedImgEl) return;
        selectedImgEl.setAttribute('alt', alt || '');
        if (title) {
            selectedImgEl.setAttribute('title', title);
        } else {
            selectedImgEl.removeAttribute('title');
        }
        setImgAltText(alt);
        setImgTitleText(title);
        setImgAltModalOpen(false);
        updateContent();
        notify('success', 'Image attributes updated.');
    }, [selectedImgEl, updateContent, notify]);

    // Crop application
    const handleApplyCrop = useCallback((croppedDataUrl, cropMeta) => {
        if (!selectedImgEl) return;
        selectedImgEl.src = croppedDataUrl;
        if (cropMeta?.isCircle) {
            selectedImgEl.style.borderRadius = '9999px';
            setImgRadius('9999px');
        }
        if (cropMeta?.width) {
            selectedImgEl.style.width = `${cropMeta.width}px`;
            selectedImgEl.style.height = 'auto';
            setImgWidthInput(cropMeta.width);
            setImgHeightInput(cropMeta.height);
        }
        updateContent();
        updateImgOverlayRect();
        notify('success', 'Image cropped successfully.');
    }, [selectedImgEl, updateContent, updateImgOverlayRect, notify]);

    // Reset image formatting
    const resetImageFormatting = useCallback(() => {
        if (!selectedImgEl) return;
        selectedImgEl.style.border = 'none';
        selectedImgEl.style.borderRadius = '12px';
        selectedImgEl.style.boxShadow = 'none';
        selectedImgEl.style.filter = 'none';
        selectedImgEl.style.width = '';
        selectedImgEl.style.height = '';
        selectedImgEl.style.maxWidth = '100%';
        selectedImgEl.style.float = 'none';
        selectedImgEl.style.display = 'block';
        selectedImgEl.style.margin = '16px auto';
        selectedImgEl.style.clear = 'both';
        selectedImgEl.setAttribute('data-wrap', 'break-center');
        syncImgStylesToState(selectedImgEl);
        updateContent();
        updateImgOverlayRect();
        notify('success', 'Image formatting reset to defaults.');
    }, [selectedImgEl, syncImgStylesToState, updateContent, updateImgOverlayRect, notify]);

    // Delete image
    const deleteSelectedImage = useCallback(() => {
        if (!selectedImgEl) return;
        selectedImgEl.remove();
        setSelectedImgEl(null);
        setImgOverlayRect(null);
        updateContent();
        notify('success', 'Image removed from document.');
    }, [selectedImgEl, updateContent, notify]);

    // Interactive mouse drag resizing on canvas handles
    const handleResizeHandleMouseDown = (e, handle) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedImgEl) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const startRect = selectedImgEl.getBoundingClientRect();
        const startW = startRect.width;
        const startH = startRect.height;
        const ratio = (selectedImgEl.naturalWidth && selectedImgEl.naturalHeight)
            ? selectedImgEl.naturalWidth / selectedImgEl.naturalHeight
            : startW / (startH || 1);

        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            let newW = startW;
            let newH = startH;

            if (handle.includes('e')) newW = Math.max(30, startW + dx);
            if (handle.includes('w')) newW = Math.max(30, startW - dx);
            if (handle.includes('s')) newH = Math.max(30, startH + dy);
            if (handle.includes('n')) newH = Math.max(30, startH - dy);

            if (lockAspectRatio) {
                if (handle === 'e' || handle === 'w') {
                    newH = newW / ratio;
                } else if (handle === 'n' || handle === 's') {
                    newW = newH * ratio;
                } else {
                    newH = newW / ratio;
                }
            }

            selectedImgEl.style.width = `${Math.round(newW)}px`;
            if (lockAspectRatio) {
                selectedImgEl.style.height = 'auto';
            } else {
                selectedImgEl.style.height = `${Math.round(newH)}px`;
            }

            setImgWidthInput(Math.round(newW));
            setImgHeightInput(Math.round(newH));
            updateImgOverlayRect();
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            updateContent();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // Table DOM Manipulation Helpers (MS Word Table Tools)
    const getActiveTableElements = useCallback(() => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return { table: null, cell: null, row: null };
        let node = sel.getRangeAt(0).commonAncestorContainer;
        if (node.nodeType === 3) node = node.parentNode;
        const table = node ? node.closest('table') : null;
        const cell = node ? node.closest('td, th') : null;
        const row = cell ? cell.closest('tr') : null;
        return { table, cell, row };
    }, []);

    const applyTableStylePreset = useCallback((presetName) => {
        const { table } = getActiveTableElements();
        if (!table) return;

        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.margin = '16px 0';

        const ths = table.querySelectorAll('th');
        const tds = table.querySelectorAll('td');
        const trs = table.querySelectorAll('tbody tr, tr');

        if (presetName === 'clean') {
            table.style.border = '1px solid #cbd5e1';
            ths.forEach(th => {
                th.style.border = '1px solid #cbd5e1';
                th.style.backgroundColor = '#f8fafc';
                th.style.color = '#0f172a';
                th.style.padding = '10px 14px';
            });
            tds.forEach(td => {
                td.style.border = '1px solid #cbd5e1';
                td.style.backgroundColor = '#ffffff';
                td.style.color = '#1e293b';
                td.style.padding = '10px 14px';
            });
        } else if (presetName === 'zebra') {
            table.style.border = '1px solid #e2e8f0';
            ths.forEach(th => {
                th.style.border = '1px solid #e2e8f0';
                th.style.backgroundColor = '#f1f5f9';
                th.style.color = '#0f172a';
                th.style.padding = '10px 14px';
            });
            trs.forEach((tr, i) => {
                tr.querySelectorAll('td').forEach(td => {
                    td.style.border = '1px solid #e2e8f0';
                    td.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f8fafc';
                    td.style.color = '#1e293b';
                    td.style.padding = '10px 14px';
                });
            });
        } else if (presetName === 'accent') {
            table.style.border = '1px solid #bfdbfe';
            ths.forEach(th => {
                th.style.border = '1px solid #93c5fd';
                th.style.backgroundColor = '#2563eb';
                th.style.color = '#ffffff';
                th.style.padding = '10px 14px';
            });
            tds.forEach(td => {
                td.style.border = '1px solid #dbeafe';
                td.style.backgroundColor = '#ffffff';
                td.style.color = '#1e293b';
                td.style.padding = '10px 14px';
            });
        } else if (presetName === 'dark') {
            table.style.border = '1px solid #334155';
            ths.forEach(th => {
                th.style.border = '1px solid #334155';
                th.style.backgroundColor = '#0f172a';
                th.style.color = '#ffffff';
                th.style.padding = '10px 14px';
            });
            tds.forEach(td => {
                td.style.border = '1px solid #475569';
                td.style.backgroundColor = '#ffffff';
                td.style.color = '#1e293b';
                td.style.padding = '10px 14px';
            });
        }
        updateContent();
        notify('success', `Applied ${presetName} style.`);
    }, [getActiveTableElements, updateContent, notify]);

    const applyTableBorderColor = useCallback((color) => {
        const { table } = getActiveTableElements();
        if (!table) return;
        table.style.borderColor = color;
        table.querySelectorAll('th, td').forEach(el => {
            el.style.borderColor = color;
        });
        updateContent();
        notify('success', 'Table border color updated.');
    }, [getActiveTableElements, updateContent, notify]);

    const applyTableCellBgColor = useCallback((color) => {
        const { cell } = getActiveTableElements();
        if (!cell) return;
        cell.style.backgroundColor = color;
        updateContent();
        notify('success', 'Cell background updated.');
    }, [getActiveTableElements, updateContent, notify]);

    const applyTableCellTextColor = useCallback((color) => {
        const { cell } = getActiveTableElements();
        if (!cell) return;
        cell.style.color = color;
        updateContent();
        notify('success', 'Cell text color updated.');
    }, [getActiveTableElements, updateContent, notify]);

    const insertTableRow = useCallback((below = true) => {
        const { table, row } = getActiveTableElements();
        if (!table || !row) return;
        const colCount = row.children.length;
        const newRow = document.createElement('tr');
        for (let i = 0; i < colCount; i++) {
            const td = document.createElement('td');
            td.style.cssText = row.children[i]?.style.cssText || 'border: 1px solid #cbd5e1; padding: 10px 14px; min-width: 60px;';
            td.innerHTML = '<br>';
            newRow.appendChild(td);
        }
        if (below) {
            row.parentNode.insertBefore(newRow, row.nextSibling);
        } else {
            row.parentNode.insertBefore(newRow, row);
        }
        updateContent();
        notify('success', 'Row inserted.');
    }, [getActiveTableElements, updateContent, notify]);

    const insertTableColumn = useCallback((right = true) => {
        const { table, cell, row } = getActiveTableElements();
        if (!table || !cell || !row) return;
        const cellIndex = Array.from(row.children).indexOf(cell);
        if (cellIndex === -1) return;

        table.querySelectorAll('tr').forEach(r => {
            const isHeader = r.closest('thead') !== null;
            const newCell = document.createElement(isHeader ? 'th' : 'td');
            const refCell = r.children[cellIndex];
            newCell.style.cssText = refCell ? refCell.style.cssText : 'border: 1px solid #cbd5e1; padding: 10px 14px; min-width: 60px;';
            newCell.innerHTML = '<br>';
            if (right) {
                r.insertBefore(newCell, refCell ? refCell.nextSibling : null);
            } else {
                r.insertBefore(newCell, refCell);
            }
        });
        updateContent();
        notify('success', 'Column inserted.');
    }, [getActiveTableElements, updateContent, notify]);

    const deleteTableRow = useCallback(() => {
        const { table, row } = getActiveTableElements();
        if (!table || !row) return;
        row.remove();
        if (table.querySelectorAll('tr').length === 0) {
            table.remove();
            setIsInTable(false);
        }
        updateContent();
        notify('success', 'Row deleted.');
    }, [getActiveTableElements, updateContent, notify]);

    const deleteTableColumn = useCallback(() => {
        const { table, cell, row } = getActiveTableElements();
        if (!table || !cell || !row) return;
        const cellIndex = Array.from(row.children).indexOf(cell);
        if (cellIndex === -1) return;

        table.querySelectorAll('tr').forEach(r => {
            if (r.children[cellIndex]) {
                r.children[cellIndex].remove();
            }
        });
        updateContent();
        notify('success', 'Column deleted.');
    }, [getActiveTableElements, updateContent, notify]);

    const deleteTable = useCallback(() => {
        const { table } = getActiveTableElements();
        if (table) {
            table.remove();
            setIsInTable(false);
            updateContent();
            notify('success', 'Table deleted.');
        }
    }, [getActiveTableElements, updateContent, notify]);

    // Link insertion
    const handleInsertLink = (e) => {
        e.preventDefault();
        if (!linkUrl || !linkUrl.trim()) {
            notify('error', 'Please enter a valid URL.');
            return;
        }

        let formattedUrl = linkUrl.trim();
        if (!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(formattedUrl)) {
            formattedUrl = `https://${formattedUrl}`;
        }

        restoreSelection();

        const display = linkText.trim() || formattedUrl;
        const targetAttr = linkTargetBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
        const linkHtml = `<a href="${formattedUrl}"${targetAttr} style="color: var(--rt-primary, #2F6FED); text-decoration: underline;">${display}</a>`;

        document.execCommand('insertHTML', false, linkHtml);
        updateContent();
        setLinkModalOpen(false);
        setLinkUrl('');
        setLinkText('');
        notify('success', 'Hyperlink inserted.');
    };

    // Image insertion with custom uploader or Base64 fallback
    const handleImageFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            notify('error', 'Image file size must be less than 5MB.');
            return;
        }

        setUploadingImage(true);
        try {
            if (typeof onImageUpload === 'function') {
                const uploadedUrl = await onImageUpload(file);
                if (uploadedUrl) {
                    insertImageHtml(uploadedUrl);
                    return;
                }
            }

            // Default Base64 Fallback
            const reader = new FileReader();
            reader.onload = () => {
                insertImageHtml(reader.result);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            notify('error', 'Failed to upload image.');
            console.error('Image upload error:', err);
        } finally {
            setUploadingImage(false);
        }
    };

    const insertImageHtml = (url) => {
        if (!url) return;
        restoreSelection();
        const imgHtml = `<img src="${url}" alt="Embedded media" data-wrap="break-center" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 16px auto; clear: both;" /><p><br></p>`;
        document.execCommand('insertHTML', false, imgHtml);
        updateContent();
        setImageModalOpen(false);
        setImageUrl('');
        notify('success', 'Image inserted.');
    };

    // MS Word Style Table insertion (Creates clean empty table with all borders around)
    const insertTableDirect = (rows, cols, withHeader = true) => {
        const r = Math.max(1, Math.min(50, Number(rows) || 3));
        const c = Math.max(1, Math.min(20, Number(cols) || 3));

        restoreSelection();

        let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">';
        let startRow = 0;
        if (withHeader) {
            tableHtml += '<thead><tr>';
            for (let j = 0; j < c; j++) {
                tableHtml += '<th style="border: 1px solid #cbd5e1; padding: 10px 14px; background-color: #f8fafc; text-align: left; font-weight: 600; min-width: 60px;"><br></th>';
            }
            tableHtml += '</tr></thead><tbody>';
            startRow = 1;
        } else {
            tableHtml += '<tbody>';
        }

        for (let i = startRow; i < r; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < c; j++) {
                tableHtml += '<td style="border: 1px solid #cbd5e1; padding: 10px 14px; min-width: 60px;"><br></td>';
            }
            tableHtml += '</tr>';
        }

        tableHtml += '</tbody></table><p><br></p>';

        document.execCommand('insertHTML', false, tableHtml);
        updateContent();
        setTableModalOpen(false);
        setShowCustomTableInputs(false);
        setHoverRows(0);
        setHoverCols(0);
        setIsInTable(true);
        setTableDesignOpen(true);
        notify('success', `Inserted empty ${r}×${c} table.`);
    };

    // Source view change handler
    const handleSourceChange = (e) => {
        const val = e.target.value;
        setSourceValue(val);
        if (editorRef.current) {
            editorRef.current.innerHTML = val;
        }
        if (onChange) onChange(val);
    };

    // Stats calculations
    const plainText = stripHtml(sourceValue);
    const charCount = plainText.length;
    const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const hasTableInDoc = Boolean(sourceValue && /<table[\s>]/i.test(sourceValue));
    const hasImageInDoc = Boolean(sourceValue && /<img[\s>]/i.test(sourceValue));

    return (
        <div className={`rte-container ${className} ${isFullScreen ? 'rte-fullscreen-mode' : ''}`}>
            {/* Full Screen Mode Top Navigation & Save Bar */}
            {isFullScreen && (
                <div className="rte-fullscreen-header">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light">
                            <FiFileText size={18} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                                {documentTitle}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {wordCount} words &bull; {charCount} characters &bull; Press <kbd className="rounded bg-slate-200 px-1 py-0.5 text-[10px] dark:bg-navy-700">Esc</kbd> to exit
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {onSave && (
                            <button
                                type="button"
                                onClick={handleTopSave}
                                disabled={saving}
                                className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-accent-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <FiSave className="h-4 w-4" />
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsFullScreen(false)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-navy-600 dark:text-slate-300 dark:hover:bg-navy-800 dark:hover:text-white transition-colors"
                            title="Exit full screen (Esc)"
                        >
                            <FiMinimize2 className="h-4 w-4" />
                            <span>Exit</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Editor Toolbar */}
            <div className="rte-toolbar">
                {/* History */}
                <div className="rte-toolbar-group">
                    <ToolbarButton icon={FiRotateCcw} title="Undo (Ctrl+Z)" onClick={() => exec('undo')} disabled={disabled} />
                    <ToolbarButton icon={FiRotateCw} title="Redo (Ctrl+Y)" onClick={() => exec('redo')} disabled={disabled} />
                </div>

                {/* Headings & Typography */}
                <div className="rte-toolbar-group" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <DropDown
                        title="Paragraph & Heading Styles (Ctrl+Alt+0 to 6)"
                        value={selectedBlock}
                        onChange={handleFormatBlock}
                        options={FORMAT_BLOCK_OPTIONS}
                        disabled={disabled}
                        size="xs"
                        className="w-28 sm:w-32"
                    />

                    <DropDown
                        title="Font Family"
                        value={selectedFont}
                        onChange={handleFontName}
                        options={fontFamilies}
                        disabled={disabled}
                        size="xs"
                        className="w-32 sm:w-40"
                    />

                    {/* Font Size Stepper Number Box (- / +) */}
                    <div
                        className="flex items-center rounded-lg border border-slate-300 bg-white p-0.5 shadow-sm dark:border-navy-600 dark:bg-navy-900/80"
                        title="Font Size in pixels"
                    >
                        <button
                            type="button"
                            title="Decrease Font Size (Ctrl+Shift+<)"
                            onClick={decreaseFontSize}
                            disabled={disabled}
                            className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-navy-700 dark:hover:text-white disabled:opacity-40 transition-colors"
                        >
                            <FiMinus size={11} />
                        </button>
                        <input
                            type="number"
                            title="Font Size (Ctrl+Shift+< to decrease, Ctrl+Shift+> to increase)"
                            value={fontSizePx}
                            onChange={(e) => applyFontSize(e.target.value)}
                            min="6"
                            max="144"
                            disabled={disabled}
                            className="h-6 w-9 text-center text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-100 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                            type="button"
                            title="Increase Font Size (Ctrl+Shift+>)"
                            onClick={increaseFontSize}
                            disabled={disabled}
                            className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-navy-700 dark:hover:text-white disabled:opacity-40 transition-colors"
                        >
                            <FiPlus size={11} />
                        </button>
                    </div>
                </div>

                {/* Inline Styles */}
                <div className="rte-toolbar-group">
                    <ToolbarButton icon={FiBold} title="Bold (Ctrl+B)" active={activeFormats.bold} onClick={() => exec('bold')} disabled={disabled} />
                    <ToolbarButton icon={FiItalic} title="Italic (Ctrl+I)" active={activeFormats.italic} onClick={() => exec('italic')} disabled={disabled} />
                    <ToolbarButton icon={FiUnderline} title="Underline (Ctrl+U)" active={activeFormats.underline} onClick={() => exec('underline')} disabled={disabled} />
                    <ToolbarButton icon={FiSlash} title="Strikethrough (Ctrl+Shift+X or Ctrl+5)" active={activeFormats.strikeThrough} onClick={() => exec('strikeThrough')} disabled={disabled} />
                    <button
                        type="button"
                        title="Subscript (Ctrl+=)"
                        onClick={() => exec('subscript')}
                        disabled={disabled}
                        className={`rte-btn rte-btn-text ${activeFormats.subscript ? 'active' : ''}`}
                    >
                        x₂
                    </button>
                    <button
                        type="button"
                        title="Superscript (Ctrl+Shift+=)"
                        onClick={() => exec('superscript')}
                        disabled={disabled}
                        className={`rte-btn rte-btn-text ${activeFormats.superscript ? 'active' : ''}`}
                    >
                        x²
                    </button>
                </div>

                {/* Text & Background Colors */}
                <div className="rte-toolbar-group" style={{ position: 'relative' }}>
                    <button
                        type="button"
                        title="Text Color"
                        disabled={disabled}
                        onClick={() => setTextColorPickerOpen(!textColorPickerOpen)}
                        className="rte-btn rte-btn-text"
                        style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                    >
                        <FiDroplet size={13} style={{ color: '#2F6FED' }} />
                        <span style={{ borderBottom: '2px solid #2F6FED', fontWeight: 'bold' }}>A</span>
                    </button>

                    {textColorPickerOpen && (
                        <div className="rte-color-popover">
                            {COLOR_SWATCHES.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => { exec('foreColor', c); setTextColorPickerOpen(false); }}
                                    className="rte-color-swatch"
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        title="Highlight Color"
                        disabled={disabled}
                        onClick={() => setBgColorPickerOpen(!bgColorPickerOpen)}
                        className="rte-btn rte-btn-text"
                    >
                        <span style={{ backgroundColor: '#FEF08A', padding: '0 0.25rem', borderRadius: '0.25rem', color: '#12131A' }}>H</span>
                    </button>

                    {bgColorPickerOpen && (
                        <div className="rte-color-popover" style={{ left: '2rem' }}>
                            {COLOR_SWATCHES.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => { exec('hiliteColor', c); setBgColorPickerOpen(false); }}
                                    className="rte-color-swatch"
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Alignment */}
                <div className="rte-toolbar-group">
                    <ToolbarButton icon={FiAlignLeft} title="Align Left (Ctrl+L)" active={activeFormats.justifyLeft} onClick={() => exec('justifyLeft')} disabled={disabled} />
                    <ToolbarButton icon={FiAlignCenter} title="Align Center (Ctrl+E)" active={activeFormats.justifyCenter} onClick={() => exec('justifyCenter')} disabled={disabled} />
                    <ToolbarButton icon={FiAlignRight} title="Align Right (Ctrl+R)" active={activeFormats.justifyRight} onClick={() => exec('justifyRight')} disabled={disabled} />
                    <ToolbarButton icon={FiAlignJustify} title="Justify (Ctrl+J)" active={activeFormats.justifyFull} onClick={() => exec('justifyFull')} disabled={disabled} />
                </div>

                {/* Text Direction (LTR / RTL / Auto) */}
                <div className="rte-toolbar-group">
                    <button
                        type="button"
                        onClick={() => setTextDirection('ltr')}
                        disabled={disabled}
                        className="rte-btn rte-btn-text"
                        style={{ padding: '0 0.35rem', fontSize: '10px', fontWeight: 700 }}
                        title="Left-to-Right Text Direction (LTR)"
                    >
                        LTR ⮞
                    </button>
                    <button
                        type="button"
                        onClick={() => setTextDirection('rtl')}
                        disabled={disabled}
                        className="rte-btn rte-btn-text"
                        style={{ padding: '0 0.35rem', fontSize: '10px', fontWeight: 700 }}
                        title="Right-to-Left Text Direction (RTL) for Urdu / Arabic"
                    >
                        ⮜ RTL
                    </button>
                    <button
                        type="button"
                        onClick={() => setTextDirection('auto')}
                        disabled={disabled}
                        className="rte-btn rte-btn-text"
                        style={{ padding: '0 0.35rem', fontSize: '10px', fontWeight: 700 }}
                        title="Auto Detect Text Direction (BiDi)"
                    >
                        ⇄ Auto
                    </button>
                </div>

                {/* Spacing Controls (Line Spacing & Word Spacing) */}
                <div className="rte-toolbar-group" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <DropDown
                        title="Line & Paragraph Spacing (1.0, 1.15, 1.5, 2.0, Nastaleeq 2.2, 2.5)"
                        value={selectedLineSpacing}
                        onChange={handleLineSpacing}
                        options={LINE_SPACING_OPTIONS}
                        disabled={disabled}
                        size="xs"
                        className="w-28 sm:w-36"
                    />

                    <DropDown
                        title="Word Spacing (Compact, Normal, Relaxed, Wide)"
                        value={selectedWordSpacing}
                        onChange={handleWordSpacing}
                        options={WORD_SPACING_OPTIONS}
                        disabled={disabled}
                        size="xs"
                        className="w-28 sm:w-36"
                    />
                </div>

                {/* Lists & Indent */}
                <div className="rte-toolbar-group">
                    <ToolbarButton icon={FiList} title="Bullet List (Ctrl+Shift+L or Ctrl+Shift+8)" active={activeFormats.insertUnorderedList} onClick={() => exec('insertUnorderedList')} disabled={disabled} />
                    <button
                        type="button"
                        title="Numbered List (Ctrl+Shift+O or Ctrl+Shift+9)"
                        onClick={() => exec('insertOrderedList')}
                        disabled={disabled}
                        className={`rte-btn rte-btn-text ${activeFormats.insertOrderedList ? 'active' : ''}`}
                    >
                        1.
                    </button>
                    <ToolbarButton icon={FiCornerDownLeft} title="Hard Line Break (Shift+Enter)" onClick={() => exec('insertLineBreak')} disabled={disabled} />
                    <ToolbarButton icon={FiCode} title="Insert Code Block (Ctrl+Shift+C or Ctrl+`)" onClick={() => handleFormatBlock('code')} disabled={disabled} />
                </div>

                {/* Media & Advanced Elements */}
                <div className="rte-toolbar-group">
                    <ToolbarButton
                        icon={FiLink}
                        title="Insert Hyperlink (Ctrl+K)"
                        disabled={disabled}
                        onClick={() => {
                            saveSelection();
                            const selText = window.getSelection()?.toString();
                            setLinkText(selText || '');
                            setLinkModalOpen(true);
                        }}
                    />
                    <ToolbarButton
                        icon={FiImage}
                        title="Insert Image (Ctrl+Shift+I)"
                        disabled={disabled}
                        onClick={() => {
                            saveSelection();
                            setImageModalOpen(true);
                        }}
                    />
                    {hasImageInDoc && (
                        <button
                            type="button"
                            onClick={() => setImageToolsOpen(!imageToolsOpen)}
                            className={`rte-btn rte-btn-text ${imageToolsOpen || selectedImgEl ? 'active' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0 0.5rem', width: 'auto' }}
                            title="Image Formatting & Picture Tools (MS Word Style)"
                        >
                            <FiSliders size={13} />
                            <span className="text-[11px] font-semibold">Image Tools</span>
                        </button>
                    )}
                    <ToolbarButton
                        icon={FiGrid}
                        title="Insert Table (Ctrl+Shift+T)"
                        disabled={disabled}
                        onClick={() => {
                            saveSelection();
                            setTableModalOpen(true);
                        }}
                    />
                    {hasTableInDoc && (
                        <button
                            type="button"
                            onClick={() => setTableDesignOpen(!tableDesignOpen)}
                            className={`rte-btn rte-btn-text ${tableDesignOpen || isInTable ? 'active' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0 0.5rem', width: 'auto' }}
                            title="Table Design & Styles (MS Word Style)"
                        >
                            <FiLayout size={13} />
                            <span className="text-[11px] font-semibold">Table Tools</span>
                        </button>
                    )}
                    <ToolbarButton icon={FiMinus} title="Horizontal Divider (Ctrl+Enter)" onClick={() => exec('insertHorizontalRule')} disabled={disabled} />
                </div>

                {/* Right Tools: HTML Source & Full Screen Toggle */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <button
                        type="button"
                        onClick={() => setShowSource(!showSource)}
                        className={`rte-btn rte-btn-text ${showSource ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', width: 'auto', padding: '0 0.625rem' }}
                        title="Toggle HTML Source Code"
                    >
                        <FiCode size={14} />
                        <span>{showSource ? 'Visual' : 'HTML'}</span>
                    </button>

                    {allowFullScreen && (
                        <button
                            type="button"
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className={`rte-btn rte-btn-text ${isFullScreen ? 'active' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', width: 'auto', padding: '0 0.625rem' }}
                            title={isFullScreen ? "Exit Full Screen (Esc)" : "Full Screen Document View (Esc to exit, Ctrl+S to save)"}
                        >
                            {isFullScreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                            <span className="hidden sm:inline">{isFullScreen ? 'Exit' : 'Full Screen'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* MS Word Table Design Contextual Ribbon Bar - Only shown when table is added */}
            {hasTableInDoc && (tableDesignOpen || isInTable) && (
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-100/95 px-3 py-1.5 dark:border-navy-700 dark:bg-navy-800/95 shadow-inner">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-accent dark:text-accent-light mr-1">
                        <FiLayout className="h-3.5 w-3.5" />
                        <span>Table Design:</span>
                    </div>

                    {/* Preset Selector */}
                    <div className="flex items-center gap-1">
                        <DropDown
                            title="Table Preset Styles"
                            value={selectedTablePreset}
                            onChange={(val) => {
                                setSelectedTablePreset(val);
                                applyTableStylePreset(val);
                            }}
                            options={TABLE_PRESETS}
                            size="xs"
                            className="w-36 sm:w-40"
                        />
                    </div>

                    {/* Border Color Popover */}
                    <div className="relative">
                        <button
                            type="button"
                            title="Change Table Border Color"
                            onClick={() => setTableBorderColorPickerOpen(!tableBorderColorPickerOpen)}
                            className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                        >
                            <FiSquare className="h-3 w-3 text-accent" />
                            <span>Borders</span>
                            <FiChevronDown className="h-3 w-3" />
                        </button>
                        {tableBorderColorPickerOpen && (
                            <div className="rte-color-popover" style={{ top: '100%', left: 0, marginTop: '4px', zIndex: 99999 }}>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Border Color</div>
                                {TABLE_BORDER_COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            applyTableBorderColor(c);
                                            setTableBorderColorPickerOpen(false);
                                        }}
                                        className="rte-color-swatch"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Shading / Cell Fill Popover */}
                    <div className="relative">
                        <button
                            type="button"
                            title="Shade Cell / Header Background Color"
                            onClick={() => setTableBgColorPickerOpen(!tableBgColorPickerOpen)}
                            className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                        >
                            <FiDroplet className="h-3 w-3 text-amber-500" />
                            <span>Shading</span>
                            <FiChevronDown className="h-3 w-3" />
                        </button>
                        {tableBgColorPickerOpen && (
                            <div className="rte-color-popover" style={{ top: '100%', left: 0, marginTop: '4px', zIndex: 99999 }}>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Cell Shading (BG)</div>
                                {TABLE_BG_COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            applyTableCellBgColor(c);
                                            setTableBgColorPickerOpen(false);
                                        }}
                                        className="rte-color-swatch"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Text Color Popover */}
                    <div className="relative">
                        <button
                            type="button"
                            title="Change Cell Text Color"
                            onClick={() => setTableTextColorPickerOpen(!tableTextColorPickerOpen)}
                            className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                        >
                            <span className="font-bold text-blue-600">A</span>
                            <span>Text</span>
                            <FiChevronDown className="h-3 w-3" />
                        </button>
                        {tableTextColorPickerOpen && (
                            <div className="rte-color-popover" style={{ top: '100%', left: 0, marginTop: '4px', zIndex: 99999 }}>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Text Color</div>
                                {COLOR_SWATCHES.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            applyTableCellTextColor(c);
                                            setTableTextColorPickerOpen(false);
                                        }}
                                        className="rte-color-swatch"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-4 w-px bg-slate-300 dark:bg-navy-600 mx-0.5" />

                    {/* MS Word Row & Column Operations */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            title="Insert Row Above"
                            onClick={() => insertTableRow(false)}
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                        >
                            + Row Above
                        </button>
                        <button
                            type="button"
                            title="Insert Row Below"
                            onClick={() => insertTableRow(true)}
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                        >
                            + Row Below
                        </button>
                        <button
                            type="button"
                            title="Insert Column Left"
                            onClick={() => insertTableColumn(false)}
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                        >
                            + Col Left
                        </button>
                        <button
                            type="button"
                            title="Insert Column Right"
                            onClick={() => insertTableColumn(true)}
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                        >
                            + Col Right
                        </button>
                    </div>

                    {/* Delete Options */}
                    <div className="flex items-center gap-1 sm:ml-auto">
                        <button
                            type="button"
                            title="Delete Current Row"
                            onClick={deleteTableRow}
                            className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                        >
                            Delete Row
                        </button>
                        <button
                            type="button"
                            title="Delete Current Column"
                            onClick={deleteTableColumn}
                            className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                        >
                            Delete Col
                        </button>
                        <button
                            type="button"
                            title="Delete Entire Table"
                            onClick={deleteTable}
                            className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                        >
                            <FiTrash2 className="h-3 w-3" />
                            <span>Delete Table</span>
                        </button>
                    </div>
                </div>
            )}

            {/* MS Word Image Format Contextual Ribbon Bar - Only shown when image is in doc & toggled/selected */}
            {hasImageInDoc && (imageToolsOpen || selectedImgEl) && (
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-100/95 px-3 py-1.5 dark:border-navy-700 dark:bg-navy-800/95 shadow-inner">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-accent dark:text-accent-light mr-1">
                        <FiImage className="h-3.5 w-3.5" />
                        <span>Picture Format:</span>
                    </div>

                    {/* Text Wrapping Selector (MS Word Style) */}
                    <div className="flex items-center gap-1">
                        <DropDown
                            title="Wrap Text Layout"
                            value={imgWrap}
                            onChange={(val) => applyImageWrap(val)}
                            options={IMAGE_WRAP_OPTIONS}
                            size="xs"
                            className="w-36 sm:w-44"
                        />
                    </div>

                    {/* Quick Preset Size Selector */}
                    <div className="flex items-center gap-1">
                        <DropDown
                            title="Quick Image Size"
                            value=""
                            placeholder="Preset Size..."
                            onChange={(val) => applyImagePresetSize(val)}
                            options={IMAGE_SIZE_PRESETS}
                            size="xs"
                            className="w-32 sm:w-36"
                        />
                    </div>

                    {/* Custom Width & Height with Aspect Ratio Lock */}
                    <div className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs dark:border-navy-600 dark:bg-navy-700">
                        <span className="text-[10px] font-bold text-slate-400">W:</span>
                        <input
                            type="number"
                            min="20"
                            max="2000"
                            placeholder="auto"
                            value={imgWidthInput}
                            onChange={(e) => applyImageDimension('width', e.target.value)}
                            className="w-12 bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none"
                            title="Image Width in Pixels"
                        />
                        <span className="text-slate-300 dark:text-navy-500">×</span>
                        <span className="text-[10px] font-bold text-slate-400">H:</span>
                        <input
                            type="number"
                            min="20"
                            max="2000"
                            placeholder="auto"
                            value={imgHeightInput}
                            onChange={(e) => applyImageDimension('height', e.target.value)}
                            className="w-12 bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none"
                            title="Image Height in Pixels"
                        />
                        <button
                            type="button"
                            onClick={() => setLockAspectRatio(!lockAspectRatio)}
                            className={`p-0.5 rounded transition-colors ${lockAspectRatio ? 'text-accent font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                            title={lockAspectRatio ? "Lock Aspect Ratio (Active)" : "Unlock Aspect Ratio"}
                        >
                            {lockAspectRatio ? <FiLock size={12} /> : <FiUnlock size={12} />}
                        </button>
                    </div>

                    {/* Crop Image Button */}
                    <button
                        type="button"
                        onClick={() => {
                            if (!selectedImgEl) {
                                notify('error', 'Please click on an image in the document first to crop it.');
                                return;
                            }
                            setImgCropModalOpen(true);
                        }}
                        className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200 shadow-sm"
                        title="Crop and Transform Image"
                    >
                        <FiCrop className="h-3.5 w-3.5 text-accent" />
                        <span>Crop</span>
                    </button>

                    {/* Divider */}
                    <div className="h-4 w-px bg-slate-300 dark:bg-navy-600 mx-0.5" />

                    {/* Borders & Outlines Popover */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setImgBorderColorPickerOpen(!imgBorderColorPickerOpen)}
                            className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                            title="Picture Border & Color"
                        >
                            <FiSquare className="h-3 w-3 text-blue-600" />
                            <span>Border</span>
                            <FiChevronDown className="h-3 w-3" />
                        </button>
                        {imgBorderColorPickerOpen && (
                            <div className="rte-color-popover" style={{ top: '100%', left: 0, marginTop: '4px', zIndex: 99999, width: '13rem' }}>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Border Style</div>
                                <div className="mb-2 grid grid-cols-3 gap-1">
                                    {IMAGE_BORDER_STYLES.map(b => (
                                        <button
                                            key={b.value}
                                            type="button"
                                            onClick={() => applyImageBorder(b.value, imgBorderThickness, imgBorderColor)}
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${imgBorderStyle === b.value ? 'bg-accent text-white border-accent' : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-navy-700 dark:text-slate-200'}`}
                                        >
                                            {b.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Thickness</div>
                                <div className="mb-2 flex items-center gap-1">
                                    {IMAGE_BORDER_WIDTHS.map(w => (
                                        <button
                                            key={w.value}
                                            type="button"
                                            onClick={() => applyImageBorder(imgBorderStyle === 'none' ? 'solid' : imgBorderStyle, w.value, imgBorderColor)}
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${imgBorderThickness === w.value ? 'bg-accent text-white border-accent' : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-navy-700 dark:text-slate-200'}`}
                                        >
                                            {w.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Border Color</div>
                                <div className="flex flex-wrap gap-1">
                                    {TABLE_BORDER_COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => {
                                                applyImageBorder(imgBorderStyle === 'none' ? 'solid' : imgBorderStyle, imgBorderThickness, c);
                                                setImgBorderColorPickerOpen(false);
                                            }}
                                            className="rte-color-swatch"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Picture Effects / Corners & Shadows Popover */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setImgEffectsPickerOpen(!imgEffectsPickerOpen)}
                            className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                            title="Picture Styles, Rounded Corners & Shadows"
                        >
                            <FiLayers className="h-3 w-3 text-purple-600" />
                            <span>Effects</span>
                            <FiChevronDown className="h-3 w-3" />
                        </button>
                        {imgEffectsPickerOpen && (
                            <div className="rte-color-popover" style={{ top: '100%', left: 0, marginTop: '4px', zIndex: 99999, width: '14rem' }}>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Corner Radius</div>
                                <div className="mb-2 grid grid-cols-2 gap-1">
                                    {IMAGE_RADIUS_OPTIONS.map(r => (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => applyImageRadius(r.value)}
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${imgRadius === r.value ? 'bg-accent text-white border-accent' : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-navy-700 dark:text-slate-200'}`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Shadows & Elevation</div>
                                <div className="mb-2 grid grid-cols-2 gap-1">
                                    {IMAGE_SHADOW_OPTIONS.map(s => (
                                        <button
                                            key={s.label}
                                            type="button"
                                            onClick={() => applyImageShadow(s.value)}
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${imgShadow === s.value ? 'bg-accent text-white border-accent' : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-navy-700 dark:text-slate-200'}`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mb-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">Color Filters</div>
                                <div className="grid grid-cols-2 gap-1">
                                    {IMAGE_FILTER_OPTIONS.map(f => (
                                        <button
                                            key={f.label}
                                            type="button"
                                            onClick={() => applyImageFilter(f.value)}
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${imgFilter === f.value ? 'bg-accent text-white border-accent' : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-navy-700 dark:text-slate-200'}`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Alt / Title Text Button */}
                    <button
                        type="button"
                        onClick={() => {
                            if (!selectedImgEl) {
                                notify('error', 'Please select an image in the editor first.');
                                return;
                            }
                            setImgAltModalOpen(true);
                        }}
                        className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-200"
                        title="Edit Alt Text & Caption"
                    >
                        <FiEdit3 className="h-3 w-3 text-emerald-600" />
                        <span>Alt / Caption</span>
                    </button>

                    {/* Reset Formatting Button */}
                    <button
                        type="button"
                        onClick={resetImageFormatting}
                        className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-300"
                        title="Reset Picture Styles back to default"
                    >
                        <FiRefreshCw className="h-3 w-3" />
                        <span>Reset</span>
                    </button>

                    {/* Delete Image */}
                    <div className="flex items-center gap-1 sm:ml-auto">
                        <button
                            type="button"
                            onClick={deleteSelectedImage}
                            className="flex items-center gap-1 rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 shadow-sm"
                            title="Remove Selected Image"
                        >
                            <FiTrash2 className="h-3 w-3" />
                            <span>Delete Image</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Editor Workspace (Embedded or Google Docs Canvas) */}
            <div className={isFullScreen ? 'rte-fullscreen-canvas' : ''}>
                {!showSource ? (
                    <div ref={editorWrapperRef} className="relative w-full">
                        <div
                            ref={editorRef}
                            contentEditable={!disabled}
                            dir="auto"
                            onClick={handleEditorClick}
                            onInput={updateContent}
                            onKeyUp={(e) => {
                                checkActiveFormats();
                                updateImgOverlayRect();
                            }}
                            onMouseUp={(e) => {
                                checkActiveFormats();
                                updateImgOverlayRect();
                            }}
                            onPaste={handlePaste}
                            placeholder={placeholder}
                            className={`prose-theme rte-editor-surface ${isFullScreen ? 'rte-fullscreen-page' : ''}`}
                            style={{ minHeight: isFullScreen ? 'calc(100vh - 180px)' : minHeight }}
                        />

                        {/* Interactive On-Canvas Image Resize Handles & Overlay */}
                        {selectedImgEl && imgOverlayRect && !disabled && (
                            <div
                                className="rte-img-overlay-wrapper"
                                style={{
                                    top: `${imgOverlayRect.top}px`,
                                    left: `${imgOverlayRect.left}px`,
                                    width: `${imgOverlayRect.width}px`,
                                    height: `${imgOverlayRect.height}px`,
                                }}
                            >
                                {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(h => (
                                    <div
                                        key={h}
                                        className={`rte-resize-handle rte-resize-${h}`}
                                        onMouseDown={(e) => handleResizeHandleMouseDown(e, h)}
                                        title={`Drag to resize (${h})`}
                                    />
                                ))}
                                <div className="rte-img-dimension-badge">
                                    {Math.round(imgOverlayRect.width)} × {Math.round(imgOverlayRect.height)} px
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <textarea
                        value={sourceValue}
                        onChange={handleSourceChange}
                        rows={10}
                        placeholder="HTML source code..."
                        className={`rte-source-view ${isFullScreen ? 'rte-fullscreen-page' : ''}`}
                        style={{ minHeight: isFullScreen ? 'calc(100vh - 180px)' : minHeight }}
                    />
                )}
            </div>

            {/* Stats Footer */}
            {showStats && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f1f5f9',
                    backgroundColor: '#f8fafc',
                    padding: '0.375rem 1rem',
                    fontSize: '0.75rem',
                    color: '#64748B'
                }}>
                    <span>{wordCount} words &bull; {charCount} characters</span>
                    <span>Rich Text Mode</span>
                </div>
            )}

            {/* Hyperlink Modal */}
            {linkModalOpen && (
                <div className="rte-modal-backdrop" onClick={() => setLinkModalOpen(false)}>
                    <div className="rte-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="rte-modal-header">
                            <h3 className="rte-modal-title">
                                <FiLink style={{ color: '#2F6FED' }} /> Insert Hyperlink
                            </h3>
                            <button type="button" onClick={() => setLinkModalOpen(false)} className="rte-btn">
                                <FiX size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                    URL Link *
                                </label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="rte-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                    Display Text (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="e.g. Read Documentation"
                                    className="rte-input"
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <input
                                    type="checkbox"
                                    id="rteTargetBlank"
                                    checked={linkTargetBlank}
                                    onChange={(e) => setLinkTargetBlank(e.target.checked)}
                                />
                                <label htmlFor="rteTargetBlank" style={{ fontSize: '0.75rem', color: '#475569', cursor: 'pointer' }}>
                                    Open link in new browser tab
                                </label>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                            <button type="button" onClick={() => setLinkModalOpen(false)} className="rte-btn-secondary">
                                Cancel
                            </button>
                            <button type="button" onClick={handleInsertLink} className="rte-btn-primary">
                                Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {imageModalOpen && (
                <div className="rte-modal-backdrop" onClick={() => setImageModalOpen(false)}>
                    <div className="rte-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="rte-modal-header">
                            <h3 className="rte-modal-title">
                                <FiImage style={{ color: '#2F6FED' }} /> Insert Image
                            </h3>
                            <button type="button" onClick={() => setImageModalOpen(false)} className="rte-btn">
                                <FiX size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                                    Upload Image File (Max 5MB)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileUpload}
                                    className="rte-input"
                                    style={{ padding: '0.375rem' }}
                                />
                            </div>
                            <div style={{ textAlign: 'center', margin: '0.25rem 0', fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                                ── Or Image URL ──
                            </div>
                            <div>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="rte-input"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                            <button type="button" onClick={() => setImageModalOpen(false)} className="rte-btn-secondary">
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!imageUrl || uploadingImage}
                                onClick={() => insertImageHtml(imageUrl)}
                                className="rte-btn-primary"
                            >
                                {uploadingImage ? 'Uploading...' : 'Insert Image'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MS Word Interactive Table Modal & Grid Picker */}
            {tableModalOpen && (
                <div className="rte-modal-backdrop" onClick={() => setTableModalOpen(false)}>
                    <div className="rte-modal-content" style={{ maxWidth: '24rem' }} onClick={(e) => e.stopPropagation()}>
                        <div className="rte-modal-header">
                            <h3 className="rte-modal-title flex items-center gap-2">
                                <FiGrid style={{ color: '#2F6FED' }} />
                                <span>Insert Table</span>
                            </h3>
                            <button type="button" onClick={() => setTableModalOpen(false)} className="rte-btn">
                                <FiX size={18} />
                            </button>
                        </div>

                        {!showCustomTableInputs ? (
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                        Hover and click to insert grid:
                                    </span>
                                    <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent dark:bg-accent/20 dark:text-accent-light">
                                        {hoverRows > 0 && hoverCols > 0 ? `${hoverCols} × ${hoverRows} Table` : '1 × 1 Table'}
                                    </span>
                                </div>

                                {/* 10 x 8 Interactive MS Word Grid */}
                                <div
                                    className="flex justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 dark:border-navy-700 dark:bg-navy-900/50"
                                    onMouseLeave={() => {
                                        setHoverRows(0);
                                        setHoverCols(0);
                                    }}
                                >
                                    <div className="grid grid-cols-10 gap-1.5">
                                        {Array.from({ length: 8 }).map((_, rowIndex) =>
                                            Array.from({ length: 10 }).map((_, colIndex) => {
                                                const r = rowIndex + 1;
                                                const c = colIndex + 1;
                                                const isHighlighted = r <= hoverRows && c <= hoverCols;

                                                return (
                                                    <button
                                                        key={`${r}-${c}`}
                                                        type="button"
                                                        onMouseEnter={() => {
                                                            setHoverRows(r);
                                                            setHoverCols(c);
                                                        }}
                                                        onClick={() => insertTableDirect(r, c, includeHeader)}
                                                        className={`h-5 w-5 rounded transition-all duration-75 ${
                                                            isHighlighted
                                                                ? 'bg-accent border border-accent shadow-sm scale-105'
                                                                : 'bg-white border border-slate-300 hover:border-accent/60 dark:bg-navy-800 dark:border-navy-600'
                                                        }`}
                                                        title={`${c} × ${r} Table`}
                                                    />
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-navy-700">
                                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeHeader}
                                            onChange={(e) => setIncludeHeader(e.target.checked)}
                                            className="rounded border-slate-300 text-accent focus:ring-accent"
                                        />
                                        <span>Include Header Row</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowCustomTableInputs(true)}
                                        className="text-xs font-semibold text-accent hover:underline dark:text-accent-light"
                                    >
                                        Custom Grid...
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                                    Enter custom number of rows and columns for your table:
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Number of Rows
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={tableRows}
                                            onChange={(e) => setTableRows(Math.max(1, Number(e.target.value)))}
                                            className="rte-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Number of Columns
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={tableCols}
                                            onChange={(e) => setTableCols(Math.max(1, Number(e.target.value)))}
                                            className="rte-input"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center gap-1.5">
                                    <input
                                        type="checkbox"
                                        id="customIncludeHeader"
                                        checked={includeHeader}
                                        onChange={(e) => setIncludeHeader(e.target.checked)}
                                        className="rounded border-slate-300 text-accent focus:ring-accent"
                                    />
                                    <label htmlFor="customIncludeHeader" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                                        Include Header Row
                                    </label>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-navy-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomTableInputs(false)}
                                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                                    >
                                        ← Back to Grid
                                    </button>

                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setTableModalOpen(false)} className="rte-btn-secondary">
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertTableDirect(tableRows, tableCols, includeHeader)}
                                            className="rte-btn-primary"
                                        >
                                            Insert Table
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MS Word Image Crop Modal */}
            {imgCropModalOpen && selectedImgEl && (
                <ImageCropModal
                    isOpen={imgCropModalOpen}
                    onClose={() => setImgCropModalOpen(false)}
                    imageSrc={selectedImgEl.src}
                    onApplyCrop={handleApplyCrop}
                    notify={notify}
                />
            )}

            {/* Image Alt & Caption Attributes Modal */}
            {imgAltModalOpen && (
                <div className="rte-modal-backdrop" onClick={() => setImgAltModalOpen(false)}>
                    <div className="rte-modal-content" style={{ maxWidth: '24rem' }} onClick={(e) => e.stopPropagation()}>
                        <div className="rte-modal-header">
                            <h3 className="rte-modal-title flex items-center gap-2">
                                <FiEdit3 style={{ color: '#2F6FED' }} />
                                <span>Image Attributes</span>
                            </h3>
                            <button type="button" onClick={() => setImgAltModalOpen(false)} className="rte-btn">
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Alt Text (Accessibility & SEO)
                                </label>
                                <input
                                    type="text"
                                    value={imgAltText}
                                    onChange={(e) => setImgAltText(e.target.value)}
                                    placeholder="Describe image..."
                                    className="rte-input"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Image Title / Tooltip (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={imgTitleText}
                                    onChange={(e) => setImgTitleText(e.target.value)}
                                    placeholder="e.g. Figure 1: Architecture overview"
                                    className="rte-input"
                                />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-navy-700">
                            <button type="button" onClick={() => setImgAltModalOpen(false)} className="rte-btn-secondary">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => applyImageAltAndTitle(imgAltText, imgTitleText)}
                                className="rte-btn-primary"
                            >
                                Save Attributes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;
