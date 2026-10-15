import { useState, useEffect, useRef } from "react";
import { GuessAgentGameDTO } from "@/types/game";

interface UseRoomTimerProps {
  game?: GuessAgentGameDTO | null;
}

export const useRoomTimer = ({ game }: UseRoomTimerProps) => {
  const turnEndTime = game?.state?.turnEndTime;
  const turnNumber = game?.state?.turnNumber;
  const isPlaying = game?.status === "PLAYING"
  const rawTimePerRound = game?.settings?.timePerRound;

  // Determine if round timer is set to infinite / unlimited
  const isInfinite =
    rawTimePerRound === -1 ||
    rawTimePerRound === 0 ||
    rawTimePerRound === null ||
    rawTimePerRound === undefined ||
    rawTimePerRound === Infinity ||
    Number(rawTimePerRound) === -1 ||
    Number(rawTimePerRound) <= 0 ||
    Number(rawTimePerRound) >= 999999 ||
    String(rawTimePerRound).toLowerCase() === "infinity" ||
    String(rawTimePerRound).toLowerCase() === "infinite" ||
    isNaN(Number(rawTimePerRound));

  const timePerRound = isInfinite ? -1 : Number(rawTimePerRound);

  // Helper to calculate seconds left based on system clock comparison
  const calculateTimeLeft = (): number => {
    if (isInfinite) {
      return -1;
    }
    // If game hasn't started or ended, return default/max round time safely
    if (!isPlaying || !turnEndTime) {
      return timePerRound ?? 0;
    }

    const difference = turnEndTime - Date.now();
    return Math.max(0, Math.floor(difference / 1000));
  };

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft);

  // Use a ref to always have the latest calculation function inside the interval
  const calcRef = useRef(calculateTimeLeft);
  calcRef.current = calculateTimeLeft;

  // 1. Sync state instantly when network updates happen (Turn changes, Page Refresh, Syncs)
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [turnEndTime, turnNumber, isPlaying, isInfinite, timePerRound]);

  // 2. Purely visual local ticker. Runs in browser memory, perfectly synchronized.
  useEffect(() => {
    if (!isPlaying || isInfinite || timeLeft < 0) return;

    const intervalId = setInterval(() => {
      const remaining = calcRef.current();
      setTimeLeft(remaining);

      if (remaining <= 0 && remaining !== -1) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isPlaying, isInfinite]);

  // 3. Helper to format seconds into an MM:SS visual string
  const formatTime = (seconds: number): string => {
    if (isInfinite || seconds === -1 || seconds < 0) return "∞";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft: isInfinite ? -1 : timeLeft,
    formattedTime: formatTime(timeLeft),
    isTimeUp: !isInfinite && timeLeft === 0,
    isInfinite,
  };
};

export const useGameTimer = useRoomTimer;