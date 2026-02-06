"use client";

import { useEffect } from "react";

export default function StickyLogoController() {
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 120) {
        document.body.classList.add("logo-stuck");
      } else {
        document.body.classList.remove("logo-stuck");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
