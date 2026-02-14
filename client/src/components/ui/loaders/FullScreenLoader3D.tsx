"use client";

/**
 * FullScreenLoader3D
 * ------------------
 * A premium-looking, dark, abstract fullscreen loader built with:
 * - Three.js via @react-three/fiber (React renderer for Three)
 * - @react-three/drei helpers (Environment preset)
 *
 * Design goals:
 * - visually interesting but not distracting
 * - dark theme friendly
 * - minimal dependencies (no external noise libs)
 * - stable animation loop (no timers, uses requestAnimationFrame via useFrame)
 *
 * Notes:
 * - This is a *client component* (uses WebGL + window).
 * - Keep it lightweight: geometry is created once via useMemo.
 */

import React, { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * Blob
 * ----
 * The central abstract object.
 *
 * Implementation details:
 * - We start with an Icosahedron (nice organic base).
 * - We add deterministic “wobble” to vertices to avoid a perfect sphere.
 * - Material is MeshPhysicalMaterial to get a subtle premium/glassy feel
 *   without going full reflective chrome.
 *
 * Performance:
 * - Geometry is created once (useMemo).
 * - Material is created once (useMemo).
 */
function Blob() {
    const geometry = useMemo(() => {
        // High-detail icosahedron: detail=64 gives a smooth blob (still reasonable for a loader).
        const g = new THREE.IcosahedronGeometry(1.15, 64);

        // Mutate positions once to create a unique, organic silhouette.
        const pos = g.attributes.position as THREE.BufferAttribute;
        const v = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);

            // Normal direction (outwards from center).
            const n = v.clone().normalize();

            // Cheap deterministic "noise" using sines of coordinates.
            // This is stable (no randomness) and requires no extra libs.
            const wobble =
                0.08 * Math.sin(v.x * 6.0) +
                0.06 * Math.sin(v.y * 5.0) +
                0.05 * Math.sin(v.z * 7.0);

            // Push vertex slightly along its normal.
            v.addScaledVector(n, wobble);

            pos.setXYZ(i, v.x, v.y, v.z);
        }

        pos.needsUpdate = true;
        g.computeVertexNormals(); // important after mutating vertices
        return g;
    }, []);

    const material = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                // Very dark base color (reads “premium” on black backgrounds).
                color: new THREE.Color("#0b0f19"),
                roughness: 0.35,
                metalness: 0.35,

                // Clearcoat adds that “polished” layer.
                clearcoat: 0.9,
                clearcoatRoughness: 0.22,

                // Subtle emissive so it never disappears in dark scenes.
                emissive: new THREE.Color("#070a12"),
                emissiveIntensity: 0.9,
            }),
        []
    );

    // We animate only material properties here (cheap).
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // Gentle pulse in emissive intensity to suggest activity.
        material.emissiveIntensity = 0.7 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.1));
    });

    return (
        <mesh geometry={geometry} material={material} castShadow receiveShadow />
    );
}

/**
 * Rings
 * -----
 * Thin torus rings around the blob to add depth + motion cues.
 * Kept subtle so the loader doesn't look like a "game".
 */
function Rings() {
    const material = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: new THREE.Color("#0f172a"),
                metalness: 0.25,
                roughness: 0.55,
                emissive: new THREE.Color("#0a0f1d"),
                emissiveIntensity: 1.2,
            }),
        []
    );

    return (
        <group>
            {/* Horizontal ring */}
            <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.2, 0.02, 16, 220]} />
            </mesh>

            {/* Slightly tilted ring for a layered look */}
            <mesh material={material} rotation={[Math.PI / 2, 0, Math.PI / 3]}>
                <torusGeometry args={[1.7, 0.02, 16, 220]} />
            </mesh>
        </group>
    );
}

/**
 * Scene
 * -----
 * Sets up lighting + environment and applies subtle “alive” motion
 * to the whole scene (rotation + breathing scale).
 *
 * Why scene-level animation:
 * - Rotating/animating a parent group is cheaper than animating many meshes.
 * - Keeps motion coherent and calm.
 */
function Scene() {
    useFrame(({ clock, scene }) => {
        const t = clock.getElapsedTime();

        // Small oscillation in rotation for organic movement.
        scene.rotation.y = 0.25 * Math.sin(t * 0.35);
        scene.rotation.x = 0.12 * Math.sin(t * 0.28);

        // Breathing scale (very subtle).
        const s = 1 + 0.03 * Math.sin(t * 1.4);
        scene.scale.setScalar(s);
    });

    return (
        <>
            {/* Ambient fill so shadows aren't harsh */}
            <ambientLight intensity={0.35} />

            {/* Key light (casts shadow) */}
            <directionalLight
                position={[3, 6, 4]}
                intensity={1.15}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            {/* Rim-ish light from the side/back */}
            <pointLight position={[-4, -1, -3]} intensity={0.9} />

            {/* Central composition */}
            <group position={[0, 0, 0]}>
                <Blob />
                <Rings />
            </group>

            {/* Environment reflections (night preset is subtle and dark-friendly) */}
            <Environment preset="night" />
        </>
    );
}

/**
 * FullScreenLoader3D
 * ------------------
 * Fullscreen overlay containing:
 * - WebGL canvas background
 * - light UI label + progress shimmer
 *
 * Accessibility:
 * - overlay is non-interactive; pointer-events disabled on background layers.
 * - add aria-live to communicate loading state if needed.
 */
export function FullScreenLoader3D({ label = "Loading" }: { label?: string }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
            {/* 
        Subtle vignette + radial glow to avoid “flat black”.
        pointer-events-none ensures loader overlay doesn't block clicks
        if you ever want to display it conditionally without locking UI.
      */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black to-black/90" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0,rgba(255,255,255,0)_55%)]" />

            {/* WebGL canvas layer */}
            <div className="absolute inset-0">
                <Canvas
                    shadows
                    // dpr array lets the renderer choose (good for perf on low-end devices)
                    dpr={[1, 2]}
                    camera={{ position: [0, 0, 6], fov: 45 }}
                >
                    {/* Fog adds depth and hides far-plane artifacts */}
                    <fog attach="fog" args={["#000000", 6, 12]} />
                    <Scene />
                </Canvas>
            </div>

            {/* Foreground UI layer */}
            <div
                className="relative z-10 flex flex-col items-center gap-3 text-white"
                aria-live="polite"
                aria-busy="true"
            >
                <div className="text-sm tracking-[0.3em] uppercase opacity-80">
                    {label}
                </div>

                {/* Minimal progress shimmer (not a real % progress, just feedback) */}
                <div className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/2 animate-[loaderbar_1.2s_ease-in-out_infinite] rounded-full bg-white/60" />
                </div>

                {/* Local keyframes so you don’t need global CSS */}
                <style jsx>{`
          @keyframes loaderbar {
            0% {
              transform: translateX(-120%);
            }
            50% {
              transform: translateX(140%);
            }
            100% {
              transform: translateX(320%);
            }
          }
        `}</style>
            </div>
        </div>
    );
}