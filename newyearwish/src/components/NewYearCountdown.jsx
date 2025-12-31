import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const getNewYearDate = () =>
  new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0);

// Hardcoded positive New Year message
const FIXED_MESSAGE = "Wishing you a joyful, prosperous, and happy New Year!! 🎉✨";

export default function NewYearCountdown() {
  const { width, height } = useWindowSize();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Displayed message
  const [displayMessage, setDisplayMessage] = useState("");

  // Temporary input for name
  const [tempName, setTempName] = useState("");

  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // Load previous name/message from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");

    if (urlName) setDisplayMessage(`${urlName}, ${FIXED_MESSAGE}`);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = getNewYearDate() - now;

      if (diff <= 0) {
        setCelebrate(true);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Add Your Name button clicked
  const addName = () => {
    const trimmedName = tempName.trim();
    if (!trimmedName) return;

    const newMessage = `${trimmedName}, ${FIXED_MESSAGE}`;
    setDisplayMessage(newMessage);
    setShowConfetti(true);

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set("name", trimmedName);
    window.history.replaceState({}, "", url);

    setTempName("");
  };

  const whatsappShare = () => {
    if (!displayMessage) return;
    const text = `${displayMessage}\n\n👉 ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="container">
      {(celebrate || showConfetti) && <Confetti width={width} height={height} recycle={true} />}

      <div className="card">
        <h1>🎆 Happy New Year 🎆</h1>

        {/* Input for name */}
        <label className="label">Enter your name</label>
        <input
          type="text"
          placeholder="Your name"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
        />

        <button className="set-name-btn" onClick={addName}>
          Add Your Name
        </button>

        <div className="timer">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="box">
              <span>{value}</span>
              <small>{unit.toUpperCase()}</small>
            </div>
          ))}
        </div>

        {/* Display the finalized message */}
        {displayMessage && (
          <>
            <div className="current-message">
              <h3>Current Message:</h3>
              <p className="wish">🎇 From {displayMessage} 🎇</p>
            </div>
            <button className="whatsapp-btn" onClick={whatsappShare}>
              Share on WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
}
