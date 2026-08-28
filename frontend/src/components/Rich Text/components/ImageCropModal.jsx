import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    FiCrop, FiRotateCw, FiRotateCcw,
    FiCheck, FiX, FiRefreshCw
} from 'react-icons/fi';

const ASPECT_RATIOS = [
    { label: 'Free', value: 'free', ratio: null },
    { label: '1:1 Square', value: '1:1', ratio: 1 },
    { label: '16:9 Widescreen', value: '16:9', ratio: 16 / 9 },
    { label: '4:3 Standard', value: '4:3', ratio: 4 / 3 },
    { label: '3:2 Classic', value: '3:2', ratio: 3 / 2 },
    { label: 'Circle / Oval', value: 'circle', ratio: 1, isCircle: true },
];

/**
 * ImageCropModal Component
 * Full-featured visual cropping tool using HTML5 Canvas
 */
export const ImageCropModal = ({
    isOpen,
    onClose,
    imageSrc,
    onApplyCrop,
    notify = () => { }
}) => {
    const [aspectRatioKey, setAspectRatioKey] = useState('free');
    const [rotation, setRotation] = useState(0);
    const [zoom] = useState(1);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const [cropRect, setCropRect] = useState({ x: 10, y: 10, width: 80, height: 80 }); // in percentages (0-100)
    const [imgLoaded, setImgLoaded] = useState(false);
    const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

    const activeHandleRef = useRef(null);
    const dragStartRef = useRef(null);

    // Reset state when opening new image
    useEffect(() => {
        if (isOpen && imageSrc) {
            setAspectRatioKey('free');
            setRotation(0);
            setFlipH(false);
            setFlipV(false);
            setImgLoaded(false);
            setCropRect({ x: 5, y: 5, width: 90, height: 90 });
        }
    }, [isOpen, imageSrc]);

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setNaturalSize({ width: naturalWidth, height: naturalHeight });
        setImgLoaded(true);
        setCropRect({ x: 5, y: 5, width: 90, height: 90 });
    };

    // Update crop rect when aspect ratio preset changes
    const applyAspectRatio = useCallback((key) => {
        setAspectRatioKey(key);
        const selected = ASPECT_RATIOS.find(r => r.value === key);
        if (!selected || !selected.ratio) return;

        const ratio = selected.ratio;
        // Adjust cropRect to match target aspect ratio based on natural image size
        const containerAspect = naturalSize.width > 0 && naturalSize.height > 0
            ? naturalSize.width / naturalSize.height
            : 1;

        let newW = 80;
        let newH = (newW / ratio) * containerAspect;

        if (newH > 90) {
            newH = 80;
            newW = (newH * ratio) / containerAspect;
        }

        const newX = Math.max(0, (100 - newW) / 2);
        const newY = Math.max(0, (100 - newH) / 2);

        setCropRect({
            x: newX,
            y: newY,
            width: Math.min(100 - newX, newW),
            height: Math.min(100 - newY, newH)
        });
    }, [naturalSize]);

    // Handle mouse drag on handles or body of crop box
    const handleMouseDown = (e, handle) => {
        e.preventDefault();
        e.stopPropagation();
        activeHandleRef.current = handle;
        dragStartRef.current = {
            clientX: e.clientX,
            clientY: e.clientY,
            crop: { ...cropRect }
        };

        const onMouseMove = (moveEvent) => {
            if (!activeHandleRef.current || !containerRef.current || !dragStartRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const dxPercent = ((moveEvent.clientX - dragStartRef.current.clientX) / rect.width) * 100;
            const dyPercent = ((moveEvent.clientY - dragStartRef.current.clientY) / rect.height) * 100;

            const startCrop = dragStartRef.current.crop;
            let { x, y, width, height } = startCrop;

            const currentPreset = ASPECT_RATIOS.find(r => r.value === aspectRatioKey);
            const lockRatio = currentPreset && currentPreset.ratio ? currentPreset.ratio : null;
            const containerAspect = naturalSize.width > 0 && naturalSize.height > 0
                ? naturalSize.width / naturalSize.height
                : 1;

            if (activeHandleRef.current === 'move') {
                x = Math.max(0, Math.min(100 - width, startCrop.x + dxPercent));
                y = Math.max(0, Math.min(100 - height, startCrop.y + dyPercent));
            } else {
                const handleName = activeHandleRef.current;

                if (handleName.includes('e')) {
                    width = Math.max(10, Math.min(100 - startCrop.x, startCrop.width + dxPercent));
                    if (lockRatio) {
                        height = Math.max(10, Math.min(100 - startCrop.y, (width / lockRatio) * containerAspect));
                    }
                }
                if (handleName.includes('s')) {
                    height = Math.max(10, Math.min(100 - startCrop.y, startCrop.height + dyPercent));
                    if (lockRatio) {
                        width = Math.max(10, Math.min(100 - startCrop.x, (height * lockRatio) / containerAspect));
                    }
                }
                if (handleName.includes('w')) {
                    const candidateW = Math.max(10, startCrop.width - dxPercent);
                    const candidateX = startCrop.x + (startCrop.width - candidateW);
                    if (candidateX >= 0) {
                        x = candidateX;
                        width = candidateW;
                        if (lockRatio) {
                            height = Math.max(10, Math.min(100 - y, (width / lockRatio) * containerAspect));
                        }
                    }
                }
                if (handleName.includes('n')) {
                    const candidateH = Math.max(10, startCrop.height - dyPercent);
                    const candidateY = startCrop.y + (startCrop.height - candidateH);
                    if (candidateY >= 0) {
                        y = candidateY;
                        height = candidateH;
                        if (lockRatio) {
                            width = Math.max(10, Math.min(100 - x, (height * lockRatio) / containerAspect));
                        }
                    }
                }
            }

            setCropRect({
                x: Math.max(0, Math.min(100 - width, x)),
                y: Math.max(0, Math.min(100 - height, y)),
                width: Math.max(10, Math.min(100, width)),
                height: Math.max(10, Math.min(100, height))
            });
        };

        const onMouseUp = () => {
            activeHandleRef.current = null;
            dragStartRef.current = null;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // Perform Canvas Crop
    const handleCrop = async () => {
        if (!imgRef.current || !naturalSize.width) return;
        setIsApplying(true);

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const isCircle = aspectRatioKey === 'circle';

            // Calculate pixel crop coordinates from percentages
            const cropX = (cropRect.x / 100) * naturalSize.width;
            const cropY = (cropRect.y / 100) * naturalSize.height;
            const cropW = (cropRect.width / 100) * naturalSize.width;
            const cropH = (cropRect.height / 100) * naturalSize.height;

            // Handle rotation transforms if any
            const rotatedCanvas = document.createElement('canvas');
            const rotCtx = rotatedCanvas.getContext('2d');

            const rad = (rotation * Math.PI) / 180;
            const is90or270 = Math.abs(rotation % 180) === 90;

            rotatedCanvas.width = is90or270 ? naturalSize.height : naturalSize.width;
            rotatedCanvas.height = is90or270 ? naturalSize.width : naturalSize.height;

            rotCtx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
            rotCtx.rotate(rad);
            rotCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
            rotCtx.drawImage(
                imgRef.current,
                -naturalSize.width / 2,
                -naturalSize.height / 2,
                naturalSize.width,
                naturalSize.height
            );

            // Now crop from the transformed image
            canvas.width = Math.round(cropW);
            canvas.height = Math.round(cropH);

            if (isCircle) {
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
            }

            ctx.drawImage(
                rotatedCanvas,
                cropX, cropY, cropW, cropH,
                0, 0, canvas.width, canvas.height
            );

            const croppedDataUrl = canvas.toDataURL('image/png', 0.95);
            onApplyCrop(croppedDataUrl, {
                width: canvas.width,
                height: canvas.height,
                isCircle
            });
            onClose();
        } catch (err) {
            console.error('Cropping error:', err);
            notify('error', 'Unable to crop this image (possible CORS restriction if loaded from external domain).');
        } finally {
            setIsApplying(false);
        }
    };

    if (!isOpen || !imageSrc) return null;

    const currentAspectObj = ASPECT_RATIOS.find(r => r.value === aspectRatioKey);
    const isCircleShape = currentAspectObj && currentAspectObj.isCircle;

    return (
        <div className="rte-modal-backdrop" onClick={onClose}>
            <div
                className="rte-modal-content max-w-2xl w-full p-5 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-navy-700">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light">
                            <FiCrop className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                Crop & Format Image
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Drag box/handles to crop or choose an aspect ratio
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-navy-700 dark:hover:text-white transition-colors"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Aspect Ratio Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-700">
                    <div className="flex flex-wrap items-center gap-1">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mr-1">
                            Ratio:
                        </span>
                        {ASPECT_RATIOS.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => applyAspectRatio(item.value)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    aspectRatioKey === item.value
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-navy-800 dark:text-slate-200 dark:hover:bg-navy-700 border border-slate-200 dark:border-navy-700'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Transform Actions */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setRotation((r) => (r - 90) % 360)}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-navy-700"
                            title="Rotate Left (90°)"
                        >
                            <FiRotateCcw className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setRotation((r) => (r + 90) % 360)}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-navy-700"
                            title="Rotate Right (90°)"
                        >
                            <FiRotateCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setAspectRatioKey('free');
                                setRotation(0);
                                setFlipH(false);
                                setFlipV(false);
                                setCropRect({ x: 5, y: 5, width: 90, height: 90 });
                            }}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-navy-700"
                            title="Reset all crop adjustments"
                        >
                            <FiRefreshCw className="h-3 w-3" />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                {/* Interactive Cropper Canvas Workspace */}
                <div
                    className="flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/90 select-none p-3"
                    style={{ minHeight: '320px', maxHeight: '480px' }}
                >
                    <div
                        ref={containerRef}
                        className="relative inline-block select-none"
                        style={{ maxWidth: '100%', maxHeight: '440px' }}
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop target"
                            crossOrigin="anonymous"
                            onLoad={handleImageLoad}
                            className="block max-h-[440px] max-w-full object-contain pointer-events-none transition-transform"
                            style={{
                                transform: `rotate(${rotation}deg) scale(${zoom}) ${flipH ? 'scaleX(-1)' : ''} ${flipV ? 'scaleY(-1)' : ''}`,
                            }}
                        />

                        {/* Dark Translucent Mask & Crop Box */}
                        {imgLoaded && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ overflow: 'hidden' }}
                            >
                            {/* Draggable Crop Box Overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${cropRect.x}%`,
                                    top: `${cropRect.y}%`,
                                    width: `${cropRect.width}%`,
                                    height: `${cropRect.height}%`,
                                    borderRadius: isCircleShape ? '9999px' : '4px',
                                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                                    border: '2px solid #2f6fed',
                                    pointerEvents: 'auto',
                                    cursor: 'move',
                                }}
                                onMouseDown={(e) => handleMouseDown(e, 'move')}
                            >
                                {/* Rule of Thirds Grid Lines (unless circle) */}
                                {!isCircleShape && (
                                    <>
                                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40 pointer-events-none" />
                                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40 pointer-events-none" />
                                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40 pointer-events-none" />
                                        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40 pointer-events-none" />
                                    </>
                                )}

                                {/* 8 Interactive Resize Handles */}
                                {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((h) => {
                                    let stylePos = {};
                                    let cursor = `${h}-resize`;

                                    if (h === 'nw') stylePos = { top: '-5px', left: '-5px' };
                                    if (h === 'n') stylePos = { top: '-5px', left: 'calc(50% - 5px)' };
                                    if (h === 'ne') stylePos = { top: '-5px', right: '-5px' };
                                    if (h === 'e') stylePos = { top: 'calc(50% - 5px)', right: '-5px' };
                                    if (h === 'se') stylePos = { bottom: '-5px', right: '-5px' };
                                    if (h === 's') stylePos = { bottom: '-5px', left: 'calc(50% - 5px)' };
                                    if (h === 'sw') stylePos = { bottom: '-5px', left: '-5px' };
                                    if (h === 'w') stylePos = { top: 'calc(50% - 5px)', left: '-5px' };

                                    return (
                                        <div
                                            key={h}
                                            onMouseDown={(e) => handleMouseDown(e, h)}
                                            style={{
                                                position: 'absolute',
                                                width: '10px',
                                                height: '10px',
                                                backgroundColor: '#2f6fed',
                                                border: '2px solid #ffffff',
                                                borderRadius: '2px',
                                                cursor,
                                                zIndex: 10,
                                                ...stylePos,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-navy-700">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {naturalSize.width > 0 && (
                            <span>
                                Original: {naturalSize.width} × {naturalSize.height} px &bull; Cropping:{' '}
                                {Math.round((cropRect.width / 100) * naturalSize.width)} ×{' '}
                                {Math.round((cropRect.height / 100) * naturalSize.height)} px
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-navy-600 dark:text-slate-200 dark:hover:bg-navy-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCrop}
                            disabled={isApplying}
                            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition-all disabled:opacity-50"
                        >
                            <FiCheck className="h-4 w-4" />
                            <span>{isApplying ? 'Applying Crop...' : 'Apply Crop'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;
