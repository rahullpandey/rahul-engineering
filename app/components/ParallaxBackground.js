"use client";

import { useEffect } from "react";

export default function ParallaxBackground() {
  useEffect(() => {
    const handleMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      document.documentElement.style.setProperty("--parallax-x", x.toFixed(3));
      document.documentElement.style.setProperty("--parallax-y", y.toFixed(3));
    };

    const handleLeave = () => {
      document.documentElement.style.setProperty("--parallax-x", "0");
      document.documentElement.style.setProperty("--parallax-y", "0");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div className="parallax-bg" aria-hidden>
      <div className="parallax-orb orb-1" />
      <div className="parallax-orb orb-2" />
      <div className="parallax-orb orb-3" />
      <div className="parallax-orb orb-4" />
    </div>
  );
}
