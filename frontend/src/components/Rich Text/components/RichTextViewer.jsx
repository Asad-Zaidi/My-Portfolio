import React from 'react';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import '../styles/rich-text.css';

/**
 * RichTextViewer Component
 * Safely renders rich HTML formatting with responsive typography and theme styling.
 *
 * @param {Object} props
 * @param {string} props.content - The raw or sanitized HTML content to display.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {Object} [props.style={}] - Inline CSS styles.
 * @param {boolean} [props.sanitize=true] - Whether to sanitize HTML (prevents XSS vulnerabilities).
 * @param {string} [props.fallback=''] - Fallback text if content is empty.
 */
export const RichTextViewer = ({
    content = '',
    className = '',
    style = {},
    sanitize = true,
    fallback = ''
}) => {
    if (!content && fallback) {
        return (
            <div className={`prose-theme ${className}`} style={{ color: '#94a3b8', fontStyle: 'italic', ...style }}>
                {fallback}
            </div>
        );
    }

    if (!content) return null;

    const htmlToRender = sanitize ? sanitizeHtml(content) : content;

    return (
        <div
            className={`prose-theme ${className}`}
            style={style}
            dangerouslySetInnerHTML={{ __html: htmlToRender }}
        />
    );
};

export default RichTextViewer;
