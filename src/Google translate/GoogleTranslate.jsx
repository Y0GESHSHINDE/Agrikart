import { useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import { MdGTranslate } from "react-icons/md";

const GoogleTranslate = () => {
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("selectedLanguage") || "en");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Initialize Google Translate
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "mr,hi,ta,te,kn,ml,gu,pa,bn", autoDisplay: false },
        "google_translate_element"
      );

      // Apply saved language preference
      if (localStorage.getItem("selectedLanguage")) {
        setTimeout(() => translateToLanguage(localStorage.getItem("selectedLanguage")), 500);
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

  const translateToLanguage = (langCode) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
      localStorage.setItem("selectedLanguage", langCode);
      setSelectedLang(langCode);
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

  const handleLanguageSelect = (langCode) => {
    translateToLanguage(langCode);
    setShowPopup(false);
  };

  const indianLanguages = [
    { code: "en", name: "English" },
    { code: "mr", name: "Marathi" },
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "gu", name: "Gujarati" },
    { code: "pa", name: "Punjabi" },
    { code: "bn", name: "Bengali" },
  ];

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Floating Translate Icons */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setShowPopup(!showPopup)}
          style={{
            width: "40px",
            height: "40px",
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
          title="Translate to Regional Language"
        >
          <MdGTranslate />
        </button>

        {selectedLang !== "en" && (
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

      {/* Language Selection Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            zIndex: 1001,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {indianLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                style={{
                  padding: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "16px",
                  color: "black",
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleTranslate;