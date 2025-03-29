import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface WordCloudProps {
  words: Array<{ text: string; value: number }>;
  width?: number;
  height?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

const CustomWordCloud: React.FC<WordCloudProps> = ({
  words,
  width = 600,
  height = 400,
  minFontSize = 14,
  maxFontSize = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const placedWordsRef = useRef<any[]>([]);
  const prevWordsRef = useRef<string>("");

  const drawWord = useCallback(
    (ctx: CanvasRenderingContext2D, word: any, alpha = 1) => {
      ctx.save();
      ctx.font = `${word.fontSize}px 'Arial', sans-serif`;
      ctx.fillStyle = `hsla(${word.hue}, 70%, 60%, ${alpha})`;
      ctx.fillText(word.text, word.x, word.y + word.fontSize);
      ctx.restore();
    },
    []
  );

  const calculateLayout = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Create a signature that includes both text and value
      const currentWordsSignature = words
        .map((w) => `${w.text}-${w.value}`)
        .join(",");
      
      // If signature hasn't changed, exit early
      if (currentWordsSignature === prevWordsRef.current) return;
      // Update the signature
      prevWordsRef.current = currentWordsSignature;

      const counts = words.map((w) => w.value);
      const maxCount = Math.max(...counts);
      const scale = (value: number) => {
        const baseSize = minFontSize;
        const sizeRange = maxFontSize - baseSize;
        return baseSize + (value / maxCount) * sizeRange;
      };

      // Update or create layout for each word.
      placedWordsRef.current = words.map((wordObj) => {
        const fontSize = scale(wordObj.value);
        ctx.font = `${fontSize}px 'Arial', sans-serif`;
        const metrics = ctx.measureText(wordObj.text);
        // If the word already exists, update its font size and dimensions
        const existing = placedWordsRef.current.find(
          (w) => w.text === wordObj.text
        );
        if (existing) {
          return {
            ...existing,
            fontSize,
            width: metrics.width,
            height: fontSize,
            // Optionally update target position
            targetX: Math.random() * (width - metrics.width),
            targetY: Math.random() * (height - fontSize),
          };
        }
        // Create a new word layout
        return {
          text: wordObj.text,
          fontSize,
          width: metrics.width,
          height: fontSize,
          x: width / 2,
          y: height / 2,
          targetX: Math.random() * (width - metrics.width),
          targetY: Math.random() * (height - fontSize),
          hue: Math.random() * 360,
          alpha: 0 // Start transparent
        };
      });
    },
    [words, width, height, minFontSize, maxFontSize]
  );

  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    let needsUpdate = false;

    placedWordsRef.current.forEach((word) => {
      // Fade-in animation
      if (word.alpha < 1) {
        word.alpha = Math.min(1, word.alpha + 0.05);
        needsUpdate = true;
      }

      // Position animation
      const dx = word.targetX - word.x;
      const dy = word.targetY - word.y;
      word.x += dx * 0.1;
      word.y += dy * 0.1;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        needsUpdate = true;
      }

      drawWord(ctx, word, word.alpha);
    });

    if (needsUpdate) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [drawWord, width, height]);

  useEffect(() => {
    if (!canvasRef.current || words.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    calculateLayout(ctx);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [words, animate, calculateLayout]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: width }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
        }}
      />
    </div>
  );
};

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [feedbackList, setFeedbackList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (inputValue.trim().length > 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setFeedbackList((prev) => [...prev, inputValue.trim()]);
        setInputValue("");
        setIsSubmitting(false);
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const wordsMap: Record<string, number> = {};
  feedbackList.forEach((feedback) => {
    const words = feedback
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(
        (word) =>
          !["the", "and", "a", "an", "is", "of", "to", "in", "it"].includes(word) &&
          word.length >= 3
      );

    // Count ALL occurrences, not just unique words per feedback
    words.forEach((word) => {
      wordsMap[word] = (wordsMap[word] || 0) + 1;
    });
  });

  const cloudWords = Object.keys(wordsMap)
    .map((word) => ({
      text: word,
      value: wordsMap[word],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Limit to top 50 words

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#95a5a6",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "14px",
          cursor: "pointer",
          marginBottom: "16px"
        }}
      >
        Back to Staff Page
      </button>
      <h2 style={{ color: "#2c3e50", marginBottom: "24px", textAlign: "center" }}>
        Feedback Word Cloud
      </h2>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "32px",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="feedback-input"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#2c3e50",
            }}
          >
            Share your thoughts
          </label>
          <textarea
            id="feedback-input"
            rows={4}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your feedback here... (Press Enter to submit)"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontFamily: "inherit",
              fontSize: "16px",
              resize: "vertical",
              minHeight: "100px",
              transition: "border-color 0.3s",
              outline: "none",
            }}
            className="focus:border-blue-500 hover:border-gray-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || inputValue.trim().length === 0}
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s",
            opacity: isSubmitting || inputValue.trim().length === 0 ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>

      {cloudWords.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "16px" }}>
            Word Cloud Visualization
          </h3>
          <CustomWordCloud
            words={cloudWords}
            width={Math.min(800, window.innerWidth - 48)}
            height={400}
          />
        </div>
      )}

      {feedbackList.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#2c3e50", marginBottom: "16px" }}>
            Collected Feedback ({feedbackList.length})
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {feedbackList.map((item, idx) => (
              <li
                key={idx}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #eee",
                  color: "#34495e",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;