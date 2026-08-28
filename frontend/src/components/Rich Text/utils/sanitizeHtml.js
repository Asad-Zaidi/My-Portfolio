/**
 * HTML Sanitizer & Utility Functions for Rich Text Editing and Display.
 * Provides safe HTML cleaning, XSS protection, MS Word / Google Docs formatting cleanup,
 * and text extraction utilities.
 */

// Tags allowed in rich text formatting
export const ALLOWED_TAGS = new Set([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup',
    'a', 'img', 'figure', 'figcaption', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'font'
]);

// Attributes allowed on formatting tags
export const ALLOWED_ATTRS = new Set([
    'style', 'class', 'href', 'src', 'alt', 'title', 'target', 'rel',
    'width', 'height', 'align', 'colspan', 'rowspan', 'border', 'cellpadding', 'cellspacing', 'loading',
    'face', 'color', 'size', 'dir'
]);

/**
 * Sanitizes an HTML string by removing disallowed tags, javascript: links, and malicious inline event handlers (XSS prevention).
 * 
 * @param {string} html - Raw HTML string to sanitize.
 * @returns {string} Clean, safe HTML string.
 */
export function sanitizeHtml(html) {
    if (!html || typeof html !== 'string') return '';

    // If it doesn't contain HTML tags, return as is
    if (!/<[a-z][\s\S]*>/i.test(html)) {
        return html;
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        function cleanNode(node) {
            const children = Array.from(node.childNodes);
            for (const child of children) {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    const tagName = child.tagName.toLowerCase();

                    if (!ALLOWED_TAGS.has(tagName)) {
                        // Strip dangerous execution elements
                        if (['script', 'iframe', 'object', 'embed', 'form', 'style', 'input', 'button', 'svg'].includes(tagName)) {
                            child.remove();
                        } else {
                            const textNode = doc.createTextNode(child.textContent || '');
                            child.replaceWith(textNode);
                        }
                    } else {
                        // Clean attributes
                        const attrs = Array.from(child.attributes);
                        for (const attr of attrs) {
                            const attrName = attr.name.toLowerCase();
                            // Disallow event handlers (onclick, onerror, onload, etc.) & unapproved attrs
                            if (attrName.startsWith('on') || (!ALLOWED_ATTRS.has(attrName) && !attrName.startsWith('data-'))) {
                                child.removeAttribute(attr.name);
                            } else if ((attrName === 'href' || attrName === 'src') && /^\s*javascript:/i.test(attr.value)) {
                                child.removeAttribute(attr.name);
                            }
                        }

                        // Ensure target="_blank" links have noopener noreferrer
                        if (tagName === 'a' && child.getAttribute('target') === '_blank') {
                            child.setAttribute('rel', 'noopener noreferrer');
                        }

                        cleanNode(child);
                    }
                }
            }
        }

        cleanNode(doc.body);
        return doc.body.innerHTML;
    } catch (e) {
        console.error('HTML Sanitization error:', e);
        return html;
    }
}

/**
 * Detects if a text string contains Right-to-Left (Urdu, Arabic, Persian, Hebrew) characters.
 * 
 * @param {string} text - Text string to test.
 * @returns {boolean} True if RTL characters are present.
 */
export function isRtlText(text) {
    if (!text || typeof text !== 'string') return false;
    const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlRegex.test(text);
}

/**
 * Cleans rich text pasted from Microsoft Word, Google Docs, or external websites.
 * Strips mso styling, XML namespaces, and comments while retaining standard formatting and RTL text direction.
 * 
 * @param {string} pastedHtml - Raw HTML from clipboard event.
 * @returns {string} Cleaned HTML string.
 */
export function cleanWordHtml(pastedHtml) {
    if (!pastedHtml || typeof pastedHtml !== 'string') return '';
    let cleaned = pastedHtml
        .replace(/<!--[\s\S]*?-->/gi, '')
        .replace(/<\/?(meta|link|style|script|xml|o:[a-z]+|w:[a-z]+|m:[a-z]+|v:[a-z]+)[^>]*>/gi, '')
        .replace(/style="[^"]*mso-[^"]*"/gi, '')
        .replace(/class="[^"]*Mso[^"]*"/gi, '');

    const sanitized = sanitizeHtml(cleaned);
    
    // If the content contains RTL text, ensure blocks have dir="auto"
    if (isRtlText(sanitized)) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(sanitized, 'text/html');
            const blocks = doc.body.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, blockquote');
            if (blocks.length > 0) {
                blocks.forEach((b) => {
                    if (!b.getAttribute('dir') && isRtlText(b.textContent)) {
                        b.setAttribute('dir', 'auto');
                    }
                });
                return doc.body.innerHTML;
            }
        } catch (e) {
            // fallback to sanitized
        }
    }

    return sanitized;
}

/**
 * Checks whether a string contains HTML tags.
 * 
 * @param {string} str - String to test.
 * @returns {boolean} True if HTML markup is present.
 */
export function isHtmlContent(str) {
    if (!str || typeof str !== 'string') return false;
    return /<[a-z][\s\S]*>/i.test(str.trim());
}

/**
 * Strips all HTML markup from a string and returns plain readable text.
 * Useful for text excerpts, character/word counters, meta tags, and search indexing.
 * 
 * @param {string} str - HTML string.
 * @returns {string} Plain text without HTML tags.
 */
export function stripHtml(str) {
    if (!str || typeof str !== 'string') return '';
    if (!/<[a-z][\s\S]*>/i.test(str)) {
        return str.trim();
    }
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        return (doc.body.textContent || doc.body.innerText || '').replace(/\s+/g, ' ').trim();
    } catch (e) {
        return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
}
