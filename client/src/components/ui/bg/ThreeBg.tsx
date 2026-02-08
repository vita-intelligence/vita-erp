"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    Float,
    MeshDistortMaterial,
    Sphere,
    Torus,
    Grid,
    Environment,
    Stars,
} from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// TYPES
// ============================================================================

interface ThreeBgProps {
    className?: string;
    eventSource?: HTMLElement | null;
}

// ============================================================================
// CAMERA CONFIGURATION
// ============================================================================

/**
 * Responsive camera positioning based on viewport width
 * Adjusts camera distance to maintain optimal viewing angle on different screen sizes
 */
function CameraRig() {
    const { camera, viewport } = useThree();

    // Responsive camera distance
    const targetZ = viewport.width < 6 ? 18 : viewport.width < 10 ? 16 : 14;

    camera.position.z = targetZ;
    camera.updateProjectionMatrix();

    return null;
}

// ============================================================================
// ANIMATION CONSTANTS
// ============================================================================

const ANIMATION = {
    // Torus rotation speeds
    TORUS_ROTATION_X: 0.08,
    TORUS_ROTATION_Y: 0.12,

    // Interactive orbit sensitivity
    YAW_SENSITIVITY: 0.35,
    PITCH_SENSITIVITY: 0.25,

    // Smoothing factor base (higher = smoother but slower)
    SMOOTHING_BASE: 0.001,
} as const;

// ============================================================================
// SCENE CONTENT
// ============================================================================

/**
 * Main 3D scene containing all objects, lights, and animations
 * Features:
 * - Three floating spheres with distortion effects
 * - Rotating wireframe torus rings
 * - Interactive mouse-based camera orbit
 * - Infinite grid floor
 * - Starfield background
 */
function SceneContent() {
    const torusRef = useRef<THREE.Group>(null);
    const rootRef = useRef<THREE.Group>(null);

    // Animation loop
    useFrame((state, delta) => {
        // Continuous torus rotation
        if (torusRef.current) {
            torusRef.current.rotation.x += delta * ANIMATION.TORUS_ROTATION_X;
            torusRef.current.rotation.y += delta * ANIMATION.TORUS_ROTATION_Y;
        }

        // Mouse-controlled camera orbit
        if (rootRef.current) {
            const x = state.pointer.x; // Horizontal [-1..1]
            const y = state.pointer.y; // Vertical [-1..1]

            const targetY = x * ANIMATION.YAW_SENSITIVITY; // Horizontal rotation
            const targetX = -y * ANIMATION.PITCH_SENSITIVITY; // Vertical rotation

            // Framerate-independent smoothing
            const smoothingFactor = 1 - Math.pow(ANIMATION.SMOOTHING_BASE, delta);

            rootRef.current.rotation.y = THREE.MathUtils.lerp(
                rootRef.current.rotation.y,
                targetY,
                smoothingFactor
            );
            rootRef.current.rotation.x = THREE.MathUtils.lerp(
                rootRef.current.rotation.x,
                targetX,
                smoothingFactor
            );
        }
    });

    return (
        <group ref={rootRef}>
            {/* Environment & Background */}
            <Environment preset="city" background={false} backgroundBlurriness={0.9} />
            <Stars
                radius={100}
                depth={50}
                count={1500}
                factor={3}
                saturation={0}
                fade
                speed={0.35}
            />

            {/* Main Center Sphere - Large white distorted sphere */}
            <Float speed={0.6} rotationIntensity={0.4} floatIntensity={1.2}>
                <Sphere args={[6, 48, 48]} position={[0, 0, -8]}>
                    <MeshDistortMaterial
                        color="#ffffff"
                        distort={0.35}
                        speed={0.8}
                        roughness={0.1}
                        metalness={0.9}
                        emissive="#334455"
                        emissiveIntensity={0.3}
                    />
                </Sphere>
            </Float>

            {/* Secondary Sphere - Medium blue-tinted sphere (left) */}
            <Float speed={1.2} rotationIntensity={1.1} floatIntensity={2.5}>
                <Sphere args={[2.2, 40, 40]} position={[-3, 1.5, -3]}>
                    <MeshDistortMaterial
                        color="#e0f0ff"
                        distort={0.55}
                        speed={2.2}
                        roughness={0}
                        metalness={1}
                        emissive="#88aaff"
                        emissiveIntensity={0.7}
                    />
                </Sphere>
            </Float>

            {/* Accent Sphere - Small bright sphere (right) */}
            <Float speed={1.8} rotationIntensity={1.5} floatIntensity={3}>
                <Sphere args={[0.9, 32, 32]} position={[4, -1, -4]}>
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#aaccff"
                        emissiveIntensity={1.05}
                        roughness={0.15}
                        metalness={0.95}
                    />
                </Sphere>
            </Float>

            {/* Wireframe Rings - Continuously rotating */}
            <group ref={torusRef}>
                {/* Inner ring */}
                <Torus args={[5, 0.12, 16, 120]} position={[0, 0, -6]}>
                    <meshBasicMaterial
                        color="#88ccff"
                        wireframe
                        opacity={0.4}
                        transparent
                    />
                </Torus>

                {/* Outer ring (tilted) */}
                <Torus
                    args={[7, 0.08, 16, 140]}
                    position={[0, 0, -10]}
                    rotation={[Math.PI / 3, 0, 0]}
                >
                    <meshBasicMaterial
                        color="#aaffcc"
                        wireframe
                        opacity={0.25}
                        transparent
                    />
                </Torus>
            </group>

            {/* Infinite Grid Floor */}
            <Grid
                args={[120, 120]}
                position={[0, -8, 0]}
                sectionColor="#444466"
                fadeDistance={40}
                fadeStrength={4}
                cellSize={1.2}
                sectionThickness={0.8}
                infiniteGrid
            />

            {/* Lighting Setup */}
            <ambientLight intensity={0.4} />
            <pointLight
                position={[8, 6, 5]}
                intensity={18}
                color="#aaccff"
                distance={30}
                decay={2}
            />
            <pointLight
                position={[-10, -4, -8]}
                intensity={12}
                color="#cceeff"
                decay={2}
            />
            <directionalLight
                position={[5, 10, 3]}
                intensity={1.2}
                color="white"
            />
        </group>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ThreeBg - Interactive 3D background component
 * 
 * Features:
 * - Responsive camera positioning
 * - Mouse-controlled scene rotation
 * - Floating animated spheres with distortion effects
 * - Wireframe torus rings
 * - Infinite grid floor
 * - Starfield background
 * 
 * @param className - Additional CSS classes for the container
 * @param eventSource - Optional HTML element to capture events from
 */
export default function ThreeBg({ className = "", eventSource }: ThreeBgProps) {
    return (
        <div className={`absolute inset-0 ${className}`}>
            <Canvas
                eventSource={eventSource ?? undefined}
                eventPrefix="client"
                camera={{ position: [0, 0, 14], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 1.5]}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.1;
                }}
            >
                <CameraRig />
                <SceneContent />
            </Canvas>
        </div>
    );
}