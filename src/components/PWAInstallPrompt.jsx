import React, { useState, useEffect } from 'react';
import './PWAInstallPrompt.css'; // We'll create this next

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isAppInstalled) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
      setShowPrompt(false);
    });
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="prompt-container">
        <div className="prompt-content">
          <img src="/logo192.png" alt="AgriKart Logo" className="prompt-logo" />
          <div className="prompt-text">
            <h3>Install AgriKart</h3>
            <p>Add to home screen for quick access</p>
          </div>
        </div>
        <div className="prompt-buttons">
          <button onClick={() => setShowPrompt(false)} className="cancel-button">Not now</button>
          <button onClick={handleInstallClick} className="install-button">Install</button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;