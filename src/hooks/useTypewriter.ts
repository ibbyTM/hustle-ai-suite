import { useState, useEffect, useCallback, useRef } from "react";

interface UseTypewriterOptions {
  speed?: number;
  enabled?: boolean;
}

export function useTypewriter(fullText: string, options: UseTypewriterOptions = {}) {
  const { speed = 20, enabled = true } = options;
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(!enabled);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    intervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fullText, speed, enabled]);

  const skipAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedText(fullText);
    setIsComplete(true);
  }, [fullText]);

  return { displayedText, isComplete, skipAnimation };
}
