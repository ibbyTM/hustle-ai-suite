import { useState, useEffect, useCallback } from "react";

interface UseTypewriterOptions {
  speed?: number;
  enabled?: boolean;
}

export function useTypewriter(fullText: string, options: UseTypewriterOptions = {}) {
  const { speed = 20, enabled = true } = options;
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(fullText);
      setIsComplete(true);
      return;
    }

    if (!fullText) {
      setDisplayedText("");
      setIsComplete(false);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed, enabled]);

  const skipAnimation = useCallback(() => {
    setDisplayedText(fullText);
    setIsComplete(true);
  }, [fullText]);

  return { displayedText, isComplete, skipAnimation };
}
