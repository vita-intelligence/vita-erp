'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { MapPin, Check, X } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Coordinates {
    lat: number;
    lng: number;
}

interface CoordinatePickerProps {
    initialLat?: number | null;
    initialLng?: number | null;
    onConfirm: (coords: Coordinates) => void;
    onClose: () => void;
}

// ============================================================================
// COORDINATE PICKER — Leaflet map modal
// Leaflet is loaded from CDN to avoid SSR issues with Next.js
// ============================================================================

export function CoordinatePicker({ initialLat, initialLng, onConfirm, onClose }: CoordinatePickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletRef = useRef<any>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const defaultLat = initialLat ?? 48.8566;   // Paris as neutral default
    const defaultLng = initialLng ?? 2.3522;

    const [coords, setCoords] = useState<Coordinates>({
        lat: initialLat ?? defaultLat,
        lng: initialLng ?? defaultLng,
    });
    const [leafletReady, setLeafletReady] = useState(false);

    // ── Load Leaflet from CDN ─────────────────────────────────────────────────
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if ((window as any).L) {
            leafletRef.current = (window as any).L;
            setLeafletReady(true);
            return;
        }

        // Inject Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Inject Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
            leafletRef.current = (window as any).L;
            setLeafletReady(true);
        };
        document.head.appendChild(script);

        return () => {
            // Don't remove — Leaflet may be used elsewhere
        };
    }, []);

    // ── Init map once Leaflet is ready ────────────────────────────────────────
    useEffect(() => {
        if (!leafletReady || !mapRef.current) return;
        const L = leafletRef.current;

        // Prevent double init
        if (mapInstanceRef.current) return;

        const map = L.map(mapRef.current).setView([coords.lat, coords.lng], 10);

        // OpenStreetMap tiles — completely free
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        // Custom pin icon — avoids default Leaflet icon path issues in Next.js
        const icon = L.divIcon({
            className: '',
            html: `<div style="
                width: 32px; height: 32px;
                background: black;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
            "></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });

        // Place initial marker if coordinates exist
        if (initialLat && initialLng) {
            markerRef.current = L.marker([initialLat, initialLng], { icon }).addTo(map);
        }

        // Click to place / move marker
        map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            const rounded = { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };

            if (markerRef.current) {
                markerRef.current.setLatLng([rounded.lat, rounded.lng]);
            } else {
                markerRef.current = L.marker([rounded.lat, rounded.lng], { icon }).addTo(map);
            }

            setCoords(rounded);
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, [leafletReady]);

    return (
        /* Backdrop */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-black" />
                        <span className="font-bold text-black text-sm">Set Location Pin</span>
                    </div>
                    <button type="button" onClick={onClose}
                        className="text-gray-400 hover:text-black transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Map */}
                <div className="relative" style={{ height: '400px' }}>
                    {!leafletReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                            <p className="text-sm text-gray-400 font-medium">Loading map…</p>
                        </div>
                    )}
                    <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t-2 border-black flex-shrink-0 bg-gray-50">
                    <div className="text-xs font-mono text-gray-500">
                        {coords.lat !== defaultLat || coords.lng !== defaultLng ? (
                            <span>
                                <span className="font-bold text-black">{coords.lat}</span>
                                {', '}
                                <span className="font-bold text-black">{coords.lng}</span>
                            </span>
                        ) : (
                            <span className="text-gray-400">Click the map to place a pin</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" radius="none"
                            onPress={onClose}
                            className="bg-white text-black border-2 border-black font-bold hover:bg-gray-100 h-9 px-4">
                            Cancel
                        </Button>
                        <Button size="sm" radius="none"
                            isDisabled={coords.lat === defaultLat && coords.lng === defaultLng && !initialLat}
                            onPress={() => onConfirm(coords)}
                            startContent={<Check size={14} />}
                            className="bg-black text-white border-2 border-black font-bold hover:bg-white hover:text-black transition-all h-9 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none disabled:opacity-40">
                            Confirm Location
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}