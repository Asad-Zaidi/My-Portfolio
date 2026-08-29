import React from 'react';
import { sanitizeHtml, stripHtml, isRtlText } from '../utils/sanitizeHtml';
import '../styles/rich-text.css';

/**
 * RichTextViewer Component
 * Safely renders rich HTML formatting with responsive typography, theme styling, and RTL support.
 *
 * @param {Object} props
 * @param {string} props.content - The raw or sanitized HTML content to display.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {Object} [props.style={}] - Inline CSS styles.
 * @param {boolean} [props.sanitize=true] - Whether to sanitize HTML (prevents XSS vulnerabilities).
 * @param {string} [props.fallback=''] - Fallback text if content is empty.
 * @param {boolean} [props.inline=false] - Whether to render inline.
 * @param {string} [props.as] - HTML wrapper tag.
 */
export const RichTextViewer = ({
    content = '',
    className = '',
    style = {},
    sanitize = true,
    fallback = '',
    inline = false,
    as: Component = inline ? 'span' : 'div'
}) => {
    if (!content && fallback) {
        return (
            <Component className={`prose-theme ${inline ? 'inline' : ''} ${className}`} style={{ color: '#94a3b8', fontStyle: 'italic', ...style }}>
                {fallback}
            </Component>
        );
    }

    if (!content) return null;

    // Normalize non-breaking spaces (&nbsp; and \u00A0) to regular spaces so text wraps naturally across lines
    const normalizedContent = typeof content === 'string'
        ? content.replace(/&nbsp;/gi, ' ').replace(/\u00A0/g, ' ')
        : content;
    const htmlToRender = sanitize ? sanitizeHtml(normalizedContent) : normalizedContent;
    const plainText = stripHtml(normalizedContent);
    const isRtl = isRtlText(plainText);

    return (
        <Component
            className={`prose-theme ${inline ? 'inline' : ''} ${isRtl ? 'is-rtl-content' : ''} ${className}`}
            dir={isRtl ? 'rtl' : 'auto'}
            style={style}
            dangerouslySetInnerHTML={{ __html: htmlToRender }}
        />
    );
};

export default RichTextViewer;

