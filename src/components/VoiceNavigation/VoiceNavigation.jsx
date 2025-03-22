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

  // Use a ref to store the recognition instance
  const recognitionRef = useRef(null);

  // Keep track of last command time to avoid duplicates
  const lastCommandTimeRef = useRef(0);

  // Initialize speech recognition availability check
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

    // Cleanup function
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

  // Process voice commands
  const processCommand = (command) => {
    if (!command) return;

    const cmd = command.toLowerCase().trim();
    console.log("Processing command:", cmd);

    // Prevent duplicate command execution (commands executed within 1.5 seconds)
    const now = Date.now();
    if (now - lastCommandTimeRef.current < 1500) {
      console.log("Command ignored (too soon after last command)");
      return;
    }
    lastCommandTimeRef.current = now;

    // Create command patterns for more flexible matching
    const matchCommand = (patterns) => {
      return patterns.some(
        (pattern) => cmd.includes(pattern) || cmd === pattern
      );
    };

    // Navigation commands
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

  // Create and configure recognition instance
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

  // Start continuous listening mode
  const startListening = () => {
    if (!isSpeechSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    try {
      // Stop any existing recognition first
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
        // Get the last result (most recent command)
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const command = lastResult[0].transcript;
          setTranscript(command);
          processCommand(command);

          // Show transcript briefly then clear it
          setTimeout(() => {
            setTranscript("");
          }, 3000);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "aborted") {
          // This is usually fine - just means the recognition was stopped
          setError(null);
        } else if (event.error === "no-speech") {
          // Don't show an error for no-speech, just log it
          console.log("No speech detected");
        } else {
          setError(`Error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Only restart if we're still supposed to be listening
        if (isEnabled && isListening) {
          console.log("Recognition ended, restarting...");
          setTimeout(() => {
            try {
              // Create a fresh instance instead of reusing the old one
              const newRecognition = createRecognitionInstance();
              if (newRecognition) {
                // Configure the new instance with the same handlers
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

      // Define a function to configure handlers (used for both initial and restarted instances)
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

  // Stop listening
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

  // Replace the two toggle functions with a single function to toggle voice functionality
  const toggleVoice = () => {
    const newEnabledState = !isEnabled;
    setIsEnabled(newEnabledState);

    if (!newEnabledState) {
      // If turning off, stop listening
      stopListening();
    } else {
      // If turning on, start listening immediately
      startListening();
    }
  };

  return (
    <SignedIn>
      <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start">
        {/* Command transcript popup */}
        {isListening && transcript && (
          <div className="mb-3 bg-white p-3 rounded-lg shadow-lg text-sm max-w-xs">
            <p className="font-semibold">I heard:</p>
            <p className="text-gray-700">"{transcript}"</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-3 bg-red-100 p-2 rounded-lg text-xs text-red-600 max-w-xs">
            {error}
          </div>
        )}

        {/* Listening indicator */}
        {isListening && (
          <div className="mb-3 bg-green-100 p-2 rounded-lg text-xs text-green-700 flex items-center">
            <div className="mr-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            Listening for commands...
          </div>
        )}

        {/* Single mic button without text */}
        <button
          onClick={toggleVoice}
          disabled={!isSpeechSupported}
          className={`rounded-full p-4 ${
            isEnabled
              ? isListening
                ? "bg-green-500"
                : "bg-green-600"
              : "bg-gray-500"
          } transition-all shadow-lg hover:shadow-xl relative ${
            !isSpeechSupported ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title={
            isEnabled ? "Turn off voice navigation" : "Turn on voice navigation"
          }
        >
          {isEnabled ? (
            <>
              <FaMicrophone className="text-white text-xl" />
              {isListening && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-ping"></span>
              )}
            </>
          ) : (
            <FaMicrophoneSlash className="text-white text-xl" />
          )}
        </button>
      </div>
    </SignedIn>
  );
};

export default VoiceNavigation;
