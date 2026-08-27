import React from 'react';

/**
 * ToolbarButton Component for RichTextEditor
 */
export const ToolbarButton = ({
    icon: Icon,
    title,
    active = false,
    onClick,
    disabled = false,
    className = ''
}) => {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={`rte-btn ${active ? 'active' : ''} ${className}`}
        >
            {Icon && <Icon size={15} />}
        </button>
    );
};

export default ToolbarButton;
