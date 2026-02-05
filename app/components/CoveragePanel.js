"use client";

import { useState } from "react";

const CITY_DATA = [
  {
    name: "Delhi",
    hotels: ["The Oberoi, New Delhi", "The Lalit, New Delhi", "Crowne Plaza, New Delhi"],
    className: "dot-delhi"
  },
  {
    name: "Gurgaon",
    hotels: ["The Oberoi, Gurgaon"],
    className: "dot-gurgaon"
  },
  {
    name: "Agra",
    hotels: ["ITC Mughal, Agra", "The Oberoi Amarvilas"],
    className: "dot-agra"
  },
  {
    name: "Udaipur",
    hotels: ["The Oberoi Udaivilas"],
    className: "dot-udaipur"
  }
];

export default function CoveragePanel() {
  const [selectedCity, setSelectedCity] = useState(CITY_DATA[0]);

  return (
    <div className="coverage-panel">
      <div className="coverage-map-panel">
        <div className="map-frame">
          <div className="map-glow" />
          {CITY_DATA.map((city) => (
            <span key={city.name} className={`map-dot ${city.className}`}>
              {city.name}
            </span>
          ))}
        </div>
      </div>
      <div className="coverage-detail">
        <div className="city-card-row">
          {CITY_DATA.map((city) => (
            <button
              key={city.name}
              type="button"
              className={city.name === selectedCity.name ? "city-card active" : "city-card"}
              onClick={() => setSelectedCity(city)}
            >
              {city.name}
            </button>
          ))}
        </div>
        <div className="hotel-list">
          <h3>{selectedCity.name}</h3>
          <ul>
            {selectedCity.hotels.map((hotel) => (
              <li key={hotel}>{hotel}</li>
            ))}
          </ul>
          <p>Additional cities can be supported with advance scheduling.</p>
        </div>
      </div>
    </div>
  );
}
