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

  return (
    <div className="coverage-panel">
      <div className="coverage-rail">
        <div className="rail-line" />
        {cityData.map((city) => (
          <button
            key={city.name}
            type="button"
            className={city.name === selectedCity.name ? "rail-dot active" : "rail-dot"}
            onClick={() => setSelectedCity(city)}
          >
            <span className="rail-city">{city.name}</span>
          </button>
        ))}
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
