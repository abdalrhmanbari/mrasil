import { useEffect } from "react";

export default function MoyasarLoader() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.8.4/moyasar.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Moyasar loaded");
      console.log("👉 window.Moyasar:", window.Moyasar); // رح تشوفه هون
    };
    script.onerror = () => {
      console.error("❌ Moyasar script failed to load");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}