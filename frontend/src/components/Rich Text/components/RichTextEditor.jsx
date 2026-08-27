import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter,
    FiAlignRight, FiAlignJustify, FiList, FiLink, FiImage, FiGrid,
    FiRotateCcw, FiRotateCw, FiCode, FiMinus, FiCornerDownLeft,
    FiX, FiDroplet, FiSlash
} from 'react-icons/fi';
import { ToolbarButton } from './ToolbarButton';
import { sanitizeHtml, cleanWordHtml, stripHtml } from '../utils/sanitizeHtml';
import '../styles/rich-text.css';

const DEFAULT_FONT_FAMILIES = [
    { name: 'Default', value: 'inherit' },
    { name: 'Sans-Serif', value: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: 'Google Sans', value: "'Google Sans', sans-serif" },
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Arial', value: "Arial, Helvetica, sans-serif" },
    { name: 'Georgia', value: "Georgia, serif" },
    { name: 'Monospace', value: 'ui-monospace, monospace' },
];

const DEFAULT_FONT_SIZES = [
    { name: 'Small', value: '1' },       // ~10-12px
    { name: 'Normal', value: '3' },      // ~16px
    { name: 'Medium', value: '4' },      // ~18-20px
    { name: 'Large', value: '5' },       // ~24px
    { name: 'Extra Large', value: '6' }, // ~32px
];

const COLOR_SWATCHES = [
    '#12131A', '#2F6FED', '#F5A524', '#10B981', '#E5484D',
    '#7C3AED', '#EC4899', '#3B82F6', '#64748B', '#000000',
    '#FFFFFF', '#FEF08A', '#BBF7D0', '#BFDBFE', '#FBCFE8'
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
    onImageUpload = null,
    toast = null
}) => {
    const editorRef = useRef(null);
    const [showSource, setShowSource] = useState(false);
    const [sourceValue, setSourceValue] = useState(value || '');
    const [activeFormats, setActiveFormats] = useState({});
    const isInternalChange = useRef(false);
    const savedRangeRef = useRef(null);

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

    // Selection helpers to preserve cursor position when opening modals
    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRangeRef.current = sel.getRangeAt(0);
        }
    };

    const restoreSelection = () => {
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
    };

    // Modal state
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [linkTargetBlank, setLinkTargetBlank] = useState(true);

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);

    const [textColorPickerOpen, setTextColorPickerOpen] = useState(false);
    const [bgColorPickerOpen, setBgColorPickerOpen] = useState(false);

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

    // Execute standard formatting commands
    const exec = (command, val = null) => {
        if (disabled) return;
        document.execCommand(command, false, val);
        if (editorRef.current) editorRef.current.focus();
        updateContent();
        checkActiveFormats();
    };

    const checkActiveFormats = () => {
        if (!editorRef.current) return;
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
    };

    // Clean paste from Word, Google Docs or websites
    const handlePaste = (e) => {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedHtml = clipboardData?.getData('text/html');
        const pastedText = clipboardData?.getData('text/plain');

        if (pastedHtml) {
            const cleaned = cleanWordHtml(pastedHtml);
            document.execCommand('insertHTML', false, cleaned);
        } else if (pastedText) {
            document.execCommand('insertText', false, pastedText);
        }
        updateContent();
    };

    // Format Block (Headings, Paragraph, Blockquote, Pre)
    const handleFormatBlock = (val) => {
        if (val === 'p' || val === 'h1' || val === 'h2' || val === 'h3' || val === 'h4' || val === 'h5' || val === 'h6' || val === 'pre' || val === 'blockquote') {
            exec('formatBlock', `<${val}>`);
        } else if (val === 'code') {
            document.execCommand('insertHTML', false, `<code>${window.getSelection()?.toString() || 'code'}</code>`);
            updateContent();
        }
    };

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
        const imgHtml = `<div style="text-align: center; margin: 16px 0;"><img src="${url}" alt="Embedded media" style="max-width: 100%; height: auto; border-radius: 12px; display: inline-block;" /></div>`;
        document.execCommand('insertHTML', false, imgHtml);
        updateContent();
        setImageModalOpen(false);
        setImageUrl('');
    };

    // Table insertion
    const handleInsertTable = (e) => {
        e.preventDefault();
        restoreSelection();
        let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid var(--rt-border, #E2E8F0);">';
        tableHtml += '<thead><tr>';
        for (let j = 0; j < tableCols; j++) {
            tableHtml += `<th style="border: 1px solid var(--rt-border, #E2E8F0); padding: 8px 12px; background: rgba(47, 111, 237, 0.08); text-align: left; font-weight: 600;">Header ${j + 1}</th>`;
        }
        tableHtml += '</tr></thead><tbody>';

        for (let i = 0; i < tableRows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < tableCols; j++) {
                tableHtml += `<td style="border: 1px solid var(--rt-border, #E2E8F0); padding: 8px 12px;">Cell ${i + 1}-${j + 1}</td>`;
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';

        document.execCommand('insertHTML', false, tableHtml);
        updateContent();
        setTableModalOpen(false);
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

    return (
        <div className={`rte-container ${className}`}>
            {/* Editor Toolbar */}
            <div className="rte-toolbar">
                {/* History */}
                <div className="rte-toolbar-group">
                    <ToolbarButton icon={FiRotateCcw} title="Undo (Ctrl+Z)" onClick={() => exec('undo')} disabled={disabled} />
                    <ToolbarButton icon={FiRotateCw} title="Redo (Ctrl+Y)" onClick={() => exec('redo')} disabled={disabled} />
                </div>

                {/* Headings & Typography */}
                <div className="rte-toolbar-group">
                    <select
                        title="Paragraph & Heading Style"
                        onChange={(e) => handleFormatBlock(e.target.value)}
                        disabled={disabled}
                        className="rte-select"
                    >
                        <option value="p">Paragraph</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="h4">Heading 4</option>
                        <option value="h5">Heading 5</option>
                        <option value="h6">Heading 6</option>
                        <option value="blockquote">Blockquote</option>
                        <option value="pre">Code Block</option>
                    </select>

                    <select
                        title="Font Family"
                        onChange={(e) => exec('fontName', e.target.value)}
                        disabled={disabled}
                        className="rte-select"
                    >
                        {DEFAULT_FONT_FAMILIES.map(f => (
                            <option key={f.name} value={f.value}>{f.name}</option>
                        ))}
                    </select>

                    <select
                        title="Font Size"
                        onChange={(e) => exec('fontSize', e.target.value)}
                        disabled={disabled}
                        className="rte-select"
                    >
                        {DEFAULT_FONT_SIZES.map(s => (
                            <option key={s.name} value={s.value}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Inline Styles */}
                <div className="rte-toolbar-group">
                    <ToolbarButton icon={FiBold} title="Bold (Ctrl+B)" active={activeFormats.bold} onClick={() => exec('bold')} disabled={disabled} />
                    <ToolbarButton icon={FiItalic} title="Italic (Ctrl+I)" active={activeFormats.italic} onClick={() => exec('italic')} disabled={disabled} />
                    <ToolbarButton icon={FiUnderline} title="Underline (Ctrl+U)" active={activeFormats.underline} onClick={() => exec('underline')} disabled={disabled} />
                    <ToolbarButton icon={FiSlash} title="Strikethrough" active={activeFormats.strikeThrough} onClick={() => exec('strikeThrough')} disabled={disabled} />
                    <button
                        type="button"
                        title="Subscript"
                        onClick={() => exec('subscript')}
                        disabled={disabled}
                        className={`rte-btn rte-btn-text ${activeFormats.subscript ? 'active' : ''}`}
                    >
                        x₂
                    </button>
                    <button
                        type="button"
                        title="Superscript"
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
                    <ToolbarButton icon={FiAlignLeft} title="Align Left" active={activeFormats.justifyLeft} onClick={() => exec('justifyLeft')} disabled={disabled} />
                    <ToolbarButton icon={FiAlignCenter} title="Align Center" active={activeFormats.justifyCenter} onClick={() => exec('justifyCenter')} disabled={disabled} />
                    <ToolbarButton icon={FiAlignRight} title="Align Right" active={activeFormats.justifyRight} onClick={() => exec('justifyRight')} disabled={disabled} />
                    <ToolbarButton icon={FiAlignJustify} title="Justify" active={activeFormats.justifyFull} onClick={() => exec('justifyFull')} disabled={disabled} />
                </div>

                {/* Lists & Indent */}
                <div className="rte-toolbar-group">
                    <ToolbarButton icon={FiList} title="Bullet List" active={activeFormats.insertUnorderedList} onClick={() => exec('insertUnorderedList')} disabled={disabled} />
                    <button
                        type="button"
                        title="Numbered List"
                        onClick={() => exec('insertOrderedList')}
                        disabled={disabled}
                        className={`rte-btn rte-btn-text ${activeFormats.insertOrderedList ? 'active' : ''}`}
                    >
                        1.
                    </button>
                    <ToolbarButton icon={FiCornerDownLeft} title="Increase Indent" onClick={() => exec('indent')} disabled={disabled} />
                </div>

                {/* Insert Elements */}
                <div className="rte-toolbar-group">
                    <ToolbarButton
                        icon={FiLink}
                        title="Insert Hyperlink"
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
                        title="Insert Image"
                        disabled={disabled}
                        onClick={() => {
                            saveSelection();
                            setImageModalOpen(true);
                        }}
                    />
                    <ToolbarButton
                        icon={FiGrid}
                        title="Insert Table"
                        disabled={disabled}
                        onClick={() => {
                            saveSelection();
                            setTableModalOpen(true);
                        }}
                    />
                    <ToolbarButton icon={FiMinus} title="Horizontal Divider" onClick={() => exec('insertHorizontalRule')} disabled={disabled} />
                </div>

                {/* HTML Source Toggle */}
                <div style={{ marginLeft: 'auto' }}>
                    <button
                        type="button"
                        onClick={() => setShowSource(!showSource)}
                        className={`rte-btn rte-btn-text ${showSource ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', width: 'auto', padding: '0 0.625rem' }}
                    >
                        <FiCode size={14} />
                        <span>{showSource ? 'Visual' : 'HTML'}</span>
                    </button>
                </div>
            </div>

            {/* Editor Workspace */}
            <div>
                {!showSource ? (
                    <div
                        ref={editorRef}
                        contentEditable={!disabled}
                        onInput={updateContent}
                        onKeyUp={checkActiveFormats}
                        onMouseUp={checkActiveFormats}
                        onPaste={handlePaste}
                        placeholder={placeholder}
                        className="prose-theme rte-editor-surface"
                        style={{ minHeight }}
                    />
                ) : (
                    <textarea
                        value={sourceValue}
                        onChange={handleSourceChange}
                        rows={10}
                        placeholder="HTML source code..."
                        className="rte-source-view"
                        style={{ minHeight }}
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

            {/* Table Modal */}
            {tableModalOpen && (
                <div className="rte-modal-backdrop" onClick={() => setTableModalOpen(false)}>
                    <div className="rte-modal-content" style={{ maxWidth: '22rem' }} onClick={(e) => e.stopPropagation()}>
                        <div className="rte-modal-header">
                            <h3 className="rte-modal-title">
                                <FiGrid style={{ color: '#2F6FED' }} /> Create Table
                            </h3>
                            <button type="button" onClick={() => setTableModalOpen(false)} className="rte-btn">
                                <FiX size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                    Rows
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={tableRows}
                                    onChange={(e) => setTableRows(Math.max(1, Number(e.target.value)))}
                                    className="rte-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                    Columns
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={tableCols}
                                    onChange={(e) => setTableCols(Math.max(1, Number(e.target.value)))}
                                    className="rte-input"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                            <button type="button" onClick={() => setTableModalOpen(false)} className="rte-btn-secondary">
                                Cancel
                            </button>
                            <button type="button" onClick={handleInsertTable} className="rte-btn-primary">
                                Create Table
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;
