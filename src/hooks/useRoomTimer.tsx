import { useState, useEffect, useRef } from "react";
import { Room } from "@/types/game";

interface UseRoomTimerProps {
  room: Room | null;
}

export const useRoomTimer = ({ room }: UseRoomTimerProps) => {
  const turnEndTime = room?.game?.turnEndTime;
  const turnNumber = room?.game?.turnNumber;
  const roomState = room?.state;

  // Helper to calculate seconds left based on system clock comparison
  const calculateTimeLeft = (): number => {
    if (room?.settings?.timePerRound === -1) {
      return -1;
    }
    // If game hasn't started or ended, return default/max round time safely
    if (roomState !== "playing" || !turnEndTime) {
      return room?.settings?.timePerRound ?? 0;
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
  }, [turnEndTime, turnNumber, roomState, room?.settings?.timePerRound]);

  // 2. Purely visual local ticker. Runs in browser memory, perfectly synchronized.
  useEffect(() => {
    if (roomState !== "playing" || timeLeft < 0) return;

    const intervalId = setInterval(() => {
      const remaining = calcRef.current();
      setTimeLeft(remaining);

      if (remaining <= 0 && remaining !== -1) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, roomState]);

  // 3. Helper to format seconds into an MM:SS visual string
  const formatTime = (seconds: number): string => {
    if (seconds === -1) return "∞";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isTimeUp: timeLeft === 0,
  };
};