"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from 'three';

function RotatingSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      const mouseX = (state.pointer.x * Math.PI) / 10;
      const mouseY = (state.pointer.y * Math.PI) / 10;
      
      sphereRef.current.rotation.x += (mouseY - sphereRef.current.rotation.x) * 0.1;
      sphereRef.current.rotation.y += (mouseX - sphereRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1.5, 32, 32]} scale={1.8}>
      <MeshDistortMaterial
        color="#ffffff"
        attach="material"
        distort={0.4}
        speed={1.5}
        wireframe={true}
        transparent={true}
        opacity={0.3}
      />
    </Sphere>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 flex items-center justify-center pt-20 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <RotatingSphere />
      </Canvas>
    </div>
  );
}
