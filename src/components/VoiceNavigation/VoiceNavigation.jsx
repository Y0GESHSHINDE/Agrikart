// VoiceNavigation.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { SignedIn } from "@clerk/clerk-react";

const VoiceNavigation = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const lastCommandTimeRef = useRef(0);

  useEffect(() => {
    const checkSpeechSupport = () => {
      const isSpeechRecognitionSupported =
        "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
      setIsSpeechSupported(isSpeechRecognitionSupported);
      if (!isSpeechRecognitionSupported) {
        setError("Speech recognition is not supported in this browser");
      }
    };

    checkSpeechSupport();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Error stopping recognition:", err);
        }
      }
    };
  }, []);

  const processCommand = (command) => {
    if (!command) return;

    const cmd = command.toLowerCase().trim();
    console.log("Processing command:", cmd);

    const now = Date.now();
    if (now - lastCommandTimeRef.current < 1500) {
      console.log("Command ignored (too soon after last command)");
      return;
    }
    lastCommandTimeRef.current = now;

    const matchCommand = (patterns) => {
      return patterns.some(
        (pattern) => cmd.includes(pattern) || cmd === pattern
      );
    };

    if (matchCommand(["go to home", "home", "go home"])) {
      navigate("/");
    } else if (matchCommand(["go to tools", "farm tools", "tools"])) {
      navigate("/Listed-instruments");
    } else if (
      matchCommand([
        "go to notifications",
        "notifications",
        "show notifications",
      ])
    ) {
      navigate("/notifications");
    } else if (
      matchCommand(["go to profile", "profile", "my profile", "show profile"])
    ) {
      navigate("/profile");
    } else if (matchCommand(["go to weather", "weather", "show weather"])) {
      navigate("/weather");
    } else if (matchCommand(["go to help", "help center", "help"])) {
      navigate("/help-center");
    } else if (matchCommand(["go to krishi", "krishi ai", "krishi"])) {
      navigate("/krishi");
    }
  };

  const createRecognitionInstance = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser");
      setIsSpeechSupported(false);
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    return recognition;
  };

  const startListening = () => {
    if (!isSpeechSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Error stopping existing recognition:", err);
        }
      }

      const recognition = createRecognitionInstance();
      if (!recognition) return;

      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const command = lastResult[0].transcript;
          setTranscript(command);
          processCommand(command);

          setTimeout(() => {
            setTranscript("");
          }, 3000);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "aborted") {
          setError(null);
        } else if (event.error === "no-speech") {
          console.log("No speech detected");
        } else {
          setError(`Error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (isEnabled && isListening) {
          console.log("Recognition ended, restarting...");
          setTimeout(() => {
            try {
              const newRecognition = createRecognitionInstance();
              if (newRecognition) {
                configureRecognitionHandlers(newRecognition);
                newRecognition.start();
                recognitionRef.current = newRecognition;
              }
            } catch (err) {
              console.error("Error restarting recognition:", err);
              setIsListening(false);
              setError(`Failed to restart listening: ${err.message}`);
            }
          }, 300);
        } else {
          setIsListening(false);
        }
      };

      const configureRecognitionHandlers = (rec) => {
        rec.onresult = recognition.onresult;
        rec.onerror = recognition.onerror;
        rec.onend = recognition.onend;
      };

      recognition.start();
      setIsListening(true);
      setError(null);
      console.log("Voice recognition started in continuous mode");
    } catch (err) {
      console.error("Error starting recognition:", err);
      setError(`Error initializing speech recognition: ${err.message}`);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
    recognitionRef.current = null;
    setIsListening(false);
    setTranscript("");
  };

  const toggleVoice = () => {
    const newEnabledState = !isEnabled;
    setIsEnabled(newEnabledState);

    if (!newEnabledState) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <SignedIn>
      <div style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        zIndex: 1000,
      }}>
        {isListening && transcript && (
          <div style={{
            marginBottom: "10px",
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            maxWidth: "200px",
            fontSize: "14px",
          }}>
            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>I heard:</p>
            <p style={{ color: "#333" }}>"{transcript}"</p>
          </div>
        )}

        {error && (
          <div style={{
            marginBottom: "10px",
            backgroundColor: "#fee2e2",
            padding: "8px",
            borderRadius: "8px",
            color: "#b91c1c",
            fontSize: "12px",
            maxWidth: "200px",
          }}>
            {error}
          </div>
        )}

        {isListening && (
          <div style={{
            marginBottom: "10px",
            backgroundColor: "#dcfce7",
            padding: "8px",
            borderRadius: "8px",
            color: "#166534",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
          }}>
            <div style={{
              marginRight: "8px",
              width: "8px",
              height: "8px",
              backgroundColor: "#22c55e",
              borderRadius: "50%",
              animation: "pulse 1.5s infinite",
            }}></div>
            Listening...
          </div>
        )}

        <button
          onClick={toggleVoice}
          disabled={!isSpeechSupported}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: isEnabled ? (isListening ? "#10b981" : "#059669") : "#d1d5db",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            position: "relative",
            opacity: isSpeechSupported ? 1 : 0.5,
          }}
          title={isEnabled ? "Turn off voice navigation" : "Turn on voice navigation"}
        >
          {isEnabled ? (
            <>
              <FaMicrophone style={{ fontSize: "20px" }} />
              {isListening && (
                <div style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  animation: "ping 1.5s infinite",
                }}></div>
              )}
            </>
          ) : (
            <FaMicrophoneSlash style={{ fontSize: "20px" }} />
          )}
        </button>
      </div>
    </SignedIn>
  );
};

export default VoiceNavigation;