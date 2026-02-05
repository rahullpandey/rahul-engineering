"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const CITY_DATA = [
  {
    name: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    hotels: ["The Oberoi, New Delhi", "The Lalit, New Delhi", "Crowne Plaza, New Delhi"]
  },
  {
    name: "Gurgaon",
    lat: 28.4595,
    lng: 77.0266,
    hotels: ["The Oberoi, Gurgaon"]
  },
  {
    name: "Agra",
    lat: 27.1767,
    lng: 78.0081,
    hotels: ["ITC Mughal, Agra", "The Oberoi Amarvilas"]
  },
  {
    name: "Udaipur",
    lat: 24.5854,
    lng: 73.7125,
    hotels: ["The Oberoi Udaivilas"]
  }
];

function latLngToVec3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function GlobeMesh({ onCitySelect }) {
  const globeRef = useRef(null);
  const cityPoints = useMemo(
    () =>
      CITY_DATA.map((city) => ({
        ...city,
        position: latLngToVec3(city.lat, city.lng, 2.35)
      })),
    []
  );

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0018;
    }
  });

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          color="#2c3e55"
          metalness={0.35}
          roughness={0.45}
          emissive="#1b2a41"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.24, 64, 64]} />
        <meshStandardMaterial color="#c8a06e" transparent opacity={0.15} />
      </mesh>
      {cityPoints.map((city) => (
        <mesh
          key={city.name}
          position={city.position}
          onClick={(event) => {
            event.stopPropagation();
            onCitySelect(city);
          }}
        >
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color="#c8a06e" emissive="#c8a06e" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function WorldGlobe() {
  const [selectedCity, setSelectedCity] = useState(CITY_DATA[0]);

  return (
    <div className="globe-wrapper">
      <div className="globe-canvas">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={1.1} />
          <hemisphereLight intensity={0.7} color="#f5efe6" groundColor="#1b2a41" />
          <directionalLight position={[4, 3, 6]} intensity={1.1} />
          <pointLight position={[-6, -3, 4]} intensity={0.6} color="#c8a06e" />
          <GlobeMesh onCitySelect={setSelectedCity} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>
      </div>
      <div className="globe-popup">
        <span>{selectedCity.name}</span>
        <ul>
          {selectedCity.hotels.map((hotel) => (
            <li key={hotel}>{hotel}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
