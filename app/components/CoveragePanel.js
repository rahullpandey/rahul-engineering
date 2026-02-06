"use client";

import { useMemo, useState } from "react";
import { COLLABORATIONS, CITY_ORDER } from "../data/collaborations";

export default function CoveragePanel() {
  const cityData = useMemo(() => {
    const cityMap = new Map();
    COLLABORATIONS.forEach((item) => {
      if (!item.city) return;
      if (!cityMap.has(item.city)) cityMap.set(item.city, []);
      cityMap.get(item.city).push(item.name);
    });

    const ordered = CITY_ORDER.filter((city) => cityMap.has(city)).map((city) => ({
      name: city,
      hotels: cityMap.get(city)
    }));

    const remaining = Array.from(cityMap.keys())
      .filter((city) => !CITY_ORDER.includes(city))
      .sort()
      .map((city) => ({ name: city, hotels: cityMap.get(city) }));

    return [...ordered, ...remaining];
  }, []);

  const [selectedCity, setSelectedCity] = useState(cityData[0] || { name: "", hotels: [] });
  const totalCities = cityData.length || 1;
  const radarRadius = 95;

  return (
    <div className="coverage-panel coverage-panel--radar">
      <div className="radar-shell">
        <div className="radar-display">
          <div className="radar-glow" aria-hidden />
          <div className="radar-ring radar-ring--outer" />
          <div className="radar-ring radar-ring--mid" />
          <div className="radar-ring radar-ring--inner" />
          <div className="radar-center" />
          {cityData.map((city, index) => {
            const angle = (index / totalCities) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radarRadius;
            const y = Math.sin(angle) * radarRadius;
            const isActive = city.name === selectedCity.name;
            return (
              <button
                key={city.name}
                type="button"
                className={isActive ? "radar-dot active" : "radar-dot"}
                onClick={() => setSelectedCity(city)}
                style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
              >
                <span className="radar-dot-core" />
                <span className="radar-dot-label">{city.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="hotel-panel" key={selectedCity.name || "empty"}>
        <h3>{selectedCity.name || "Coverage"}</h3>
        <ul>
          {(selectedCity.hotels || []).map((hotel) => (
            <li key={hotel}>{hotel}</li>
          ))}
        </ul>
        <p>Additional cities can be supported with advance scheduling.</p>
      </div>
    </div>
  );
}
