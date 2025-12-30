"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Scroll, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const MANIFESTO_STORAGE_KEY = "kd_manifesto_seen";

const manifestoPages = [
    {
        src: "/manifesto-page-1.jpg",
        alt: "The Manifesto - The Catalyst, The Opportunity Gap, Our Solution",
    },
    {
        src: "/manifesto-page-2.jpg",
        alt: "The Manifesto - Innovation Spiral, Our Vision & Promise",
    },
];

interface ManifestoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ManifestoModal({ isOpen, onClose }: ManifestoModalProps) {
    // Zoom/Pan state remains internal as it's UI state
    const [currentPage, setCurrentPage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Reset zoom state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setCurrentPage(0);
            resetZoomState();
        } else {
            resetZoomState();
        }
    }, [isOpen]);


    // Helper to reset zoom state
    const resetZoomState = () => {
        setIsZoomed(false);
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
    };

    const handleClose = () => {
        onClose();
    };

    const nextPage = () => {
        if (currentPage < manifestoPages.length - 1 && !isZoomed) {
            resetZoomState();
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0 && !isZoomed) {
            resetZoomState();
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (index: number) => {
        if (!isZoomed) {
            resetZoomState();
            setCurrentPage(index);
        }
    };

    const toggleZoom = () => {
        if (isZoomed) {
            resetZoomState();
        } else {
            setIsZoomed(true);
            setZoomLevel(2);
        }
    };

    const handleZoomIn = () => {
        if (zoomLevel < 4) {
            setZoomLevel(prev => Math.min(prev + 0.5, 4));
            setIsZoomed(true);
        }
    };

    const handleZoomOut = () => {
        if (zoomLevel > 1) {
            const newZoom = Math.max(zoomLevel - 0.5, 1);
            setZoomLevel(newZoom);
            if (newZoom === 1) {
                resetZoomState();
            }
        }
    };

    // Mouse/touch drag for panning
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isZoomed) return;
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setDragStart({ x: clientX - panPosition.x, y: clientY - panPosition.y });
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !isZoomed) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setPanPosition({
            x: clientX - dragStart.x,
            y: clientY - dragStart.y,
        });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Double tap/click to zoom
    const handleImageClick = (e: React.MouseEvent) => {
        // Toggle zoom on double click
        if (e.detail === 2) {
            toggleZoom();
        }
    };

    return (
        <>
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        onClick={isZoomed ? () => { } : handleClose}
                    />

                    {/* Modal Container */}
                    <div className={`relative z-10 w-full max-h-[95vh] flex flex-col bg-popover border-2 border-neon-primary/50 rounded-lg overflow-hidden shadow-[0_0_50px_var(--neon-primary)] transition-all duration-300 ${isZoomed ? 'max-w-6xl' : 'max-w-4xl'}`}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-popover/90 border-b border-neon-primary/30">
                            <h2 className="font-mono text-lg sm:text-xl md:text-2xl font-bold text-neon-primary tracking-wider flex items-center gap-2">
                                <Scroll className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="hidden xs:inline">OUR </span>MANIFESTO
                            </h2>

                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={handleZoomOut}
                                    disabled={zoomLevel <= 1}
                                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${zoomLevel <= 1
                                        ? "text-muted-foreground/50 cursor-not-allowed"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                    aria-label="Zoom out"
                                >
                                    <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                <span className="text-xs sm:text-sm font-mono text-muted-foreground min-w-[3rem] text-center">
                                    {Math.round(zoomLevel * 100)}%
                                </span>

                                <button
                                    onClick={handleZoomIn}
                                    disabled={zoomLevel >= 4}
                                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${zoomLevel >= 4
                                        ? "text-muted-foreground/50 cursor-not-allowed"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                    aria-label="Zoom in"
                                >
                                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                <button
                                    onClick={toggleZoom}
                                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ml-1 ${isZoomed
                                        ? "text-neon-primary bg-neon-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                    aria-label={isZoomed ? "Exit fullscreen" : "Fullscreen"}
                                >
                                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                <button
                                    onClick={handleClose}
                                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors ml-1 sm:ml-2"
                                    aria-label="Close manifesto"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Image Container */}
                        <div
                            className="relative flex-1 overflow-hidden bg-background"
                            style={{ minHeight: isZoomed ? '70vh' : '50vh' }}
                        >
                            {/* Navigation Arrows - Hidden when zoomed */}
                            {!isZoomed && (
                                <>
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 0}
                                        className={`absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 md:p-3 rounded-full bg-popover/80 border border-neon-primary/50 transition-all ${currentPage === 0
                                            ? "opacity-30 cursor-not-allowed"
                                            : "hover:bg-neon-primary/20 hover:border-neon-primary"
                                            }`}
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-neon-primary" />
                                    </button>

                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === manifestoPages.length - 1}
                                        className={`absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 md:p-3 rounded-full bg-popover/80 border border-neon-primary/50 transition-all ${currentPage === manifestoPages.length - 1
                                            ? "opacity-30 cursor-not-allowed"
                                            : "hover:bg-neon-primary/20 hover:border-neon-primary"
                                            }`}
                                        aria-label="Next page"
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-neon-primary" />
                                    </button>
                                </>
                            )}

                            {/* Tap to zoom hint - Mobile only */}
                            {!isZoomed && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 sm:hidden">
                                    <span className="text-xs text-muted-foreground bg-background/60 px-2 py-1 rounded">
                                        Double-tap to zoom
                                    </span>
                                </div>
                            )}

                            {/* Image Carousel / Zoomed View */}
                            <div
                                className={`flex h-full ${isZoomed ? 'overflow-auto cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
                                style={!isZoomed ? { transform: `translateX(-${currentPage * 100}%)`, transition: 'transform 0.5s ease-out' } : {}}
                                onMouseDown={handleDragStart}
                                onMouseMove={handleDragMove}
                                onMouseUp={handleDragEnd}
                                onMouseLeave={handleDragEnd}
                                onTouchStart={handleDragStart}
                                onTouchMove={handleDragMove}
                                onTouchEnd={handleDragEnd}
                            >
                                {isZoomed ? (
                                    // Zoomed single image view with pan
                                    <div
                                        className="w-full h-full flex items-center justify-center overflow-auto"
                                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={manifestoPages[currentPage].src}
                                            alt={manifestoPages[currentPage].alt}
                                            className="transition-transform duration-200 select-none"
                                            style={{
                                                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                                                transformOrigin: 'center center',
                                            }}
                                            draggable={false}
                                            onClick={handleImageClick}
                                        />
                                    </div>
                                ) : (
                                    // Normal carousel view
                                    manifestoPages.map((page, index) => (
                                        <div
                                            key={index}
                                            className="flex-shrink-0 w-full h-full flex items-center justify-center p-2 sm:p-4"
                                        >
                                            <div
                                                className="relative w-full h-[55vh] sm:h-[60vh] cursor-zoom-in"
                                                onClick={handleImageClick}
                                            >
                                                <Image
                                                    src={page.src}
                                                    alt={page.alt}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    className="object-contain rounded-md"
                                                    draggable={false}
                                                    priority={index === 0}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Footer with pagination and CTA */}
                        <div className="flex flex-col items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-5 bg-popover/90 border-t border-neon-primary/30">
                            {/* Page Indicators - Hidden when zoomed */}
                            {!isZoomed && (
                                <>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        {manifestoPages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToPage(index)}
                                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${currentPage === index
                                                    ? "bg-neon-primary scale-125"
                                                    : "bg-muted-foreground/50 hover:bg-muted-foreground"
                                                    }`}
                                                aria-label={`Go to page ${index + 1}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Page Counter */}
                                    <p className="text-muted-foreground font-mono text-xs sm:text-sm">
                                        Page {currentPage + 1} of {manifestoPages.length}
                                    </p>
                                </>
                            )}

                            {/* Zoom instruction when zoomed */}
                            {isZoomed && (
                                <p className="text-muted-foreground font-mono text-xs sm:text-sm">
                                    Drag to pan • Use +/- to zoom • Click outside or X to close
                                </p>
                            )}

                            {/* CTA Button */}
                            <button
                                onClick={isZoomed ? toggleZoom : handleClose}
                                className="group relative px-6 sm:px-8 py-2.5 sm:py-3 bg-neon-primary hover:bg-neon-primary/80 text-background font-bold font-mono text-sm sm:text-lg rounded transition-all duration-300 hover:shadow-[0_0_20px_var(--neon-primary)]"
                            >
                                <span className="flex items-center gap-2">
                                    {isZoomed ? "EXIT ZOOM" : "ENTER THE ISLAND"}
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
