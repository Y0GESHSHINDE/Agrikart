import { useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import { MdGTranslate } from "react-icons/md";

const GoogleTranslate = () => {
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("selectedLanguage") || "en");

  useEffect(() => {
    // Initialize Google Translate
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "mr", autoDisplay: false },
        "google_translate_element"
      );

      // Apply saved language preference
      if (localStorage.getItem("selectedLanguage") === "mr") {
        setTimeout(() => translateToMarathi(), 500);
      }
    };

    // Load Google Translate script dynamically
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = googleTranslateElementInit;

    // Hide unwanted Google Translate UI elements
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame, .goog-te-balloon-frame, .goog-te-gadget-icon { display: none !important; }
      body { top: 0px !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const translateToMarathi = () => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = "mr";
      select.dispatchEvent(new Event("change"));
      localStorage.setItem("selectedLanguage", "mr");
      setSelectedLang("mr");
    }
  };

  const resetToEnglish = () => {
    localStorage.setItem("selectedLanguage", "en");
    setSelectedLang("en");

    // Remove the "googtrans" cookie properly for all paths
    document.cookie =
      "googtrans=; path=/; domain=" +
      window.location.hostname +
      "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      
    document.cookie =
      "googtrans=; path=/; domain=." +
      window.location.hostname +
      "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // Force refresh to clear translation
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Floating Translate Icons */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        {selectedLang !== "mr" && (
          <button
            onClick={translateToMarathi}
            style={{
              width: "50px",
              height: "50px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            title="Translate to Marathi"
          >
            <MdGTranslate />
          </button>
        )}

        {selectedLang === "mr" && (
          <button
            onClick={resetToEnglish}
            style={{
              width: "50px",
              height: "50px",
              background: "blue",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            title="Back to English"
          >
            <FaRedo />
          </button>
        )}
      </div>
    </>
  );
};

export default GoogleTranslate;
