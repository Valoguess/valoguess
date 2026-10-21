"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/socket";
import { ServerEvents } from "@/socket/events";
import { useGameStore } from "@/store/gameStore";
import { createGame, startGame } from "@/socket/emitter";
import { Party } from "@/types/party";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { toast } from "sonner";

interface UseGameLifecycleProps {
  party: Party | null;
  userId?: string;
  onSetErrorMsg?: (msg: string) => void;
  onSetIsCreatingOrJoining?: (val: boolean) => void;
}

export function useGameLifecycle({
  party,
  userId,
  onSetErrorMsg,
  onSetIsCreatingOrJoining,
}: UseGameLifecycleProps) {
  const router = useRouter();
  const { game, clearGame } = useGameStore();
  const [isStartingGame, setIsStartingGame] = useState(false);
  const startedGameRef = useRef<string | null>(null);

  const isHost = party ? party.leaderId === userId : true;
  const opponent = party?.members?.find((m) => m.id !== userId);

  // Clear any finished or waiting stale game state on (home) entry
  useEffect(() => {
    if (game && (game.status === "FINISHED" || game.status === "WAITING")) {
      clearGame();
    }
  }, []);

  // Reset starting state if party changes or opponent leaves
  useEffect(() => {
    if (!opponent?.id) {
      setIsStartingGame(false);
    }
  }, [opponent?.id]);

  // Game lifecycle handling: auto-redirect all party members in (home) to /play when game starts
  useEffect(() => {
    if (!game) return;

    if (game.status === "WAITING") {
      setIsStartingGame(true);
      if (isHost) {
        if (startedGameRef.current !== game.id) {
          startedGameRef.current = game.id;
          startGame();
        }
      }
      return;
    }

    if (game.status === "STARTING" || game.status === "PLAYING") {
      setIsStartingGame(true);
      router.push("/play");
    }
  }, [game?.status, game?.id, isHost, router]);

  // Safety fallback: if match launch hangs for > 8s without transitioning to STARTING/PLAYING, reset
  useEffect(() => {
    if (!isStartingGame) return;
    const timer = setTimeout(() => {
      if (!game || game.status === "WAITING" || game.status === "FINISHED") {
        setIsStartingGame(false);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [isStartingGame, game]);

  // Socket error handler
  useEffect(() => {
    const onError = (err: any) => {
      setIsStartingGame(false);
      onSetIsCreatingOrJoining?.(false);
      startedGameRef.current = null;
      if (err?.code === "GAME_ALREADY_STARTED" && game?.id) {
        router.push("/play");
        return;
      }
      const msg = err?.message || "An error occurred";
      toast.error(msg);
      onSetErrorMsg?.(msg);
      setTimeout(() => onSetErrorMsg?.(""), 4000);
    };

    socket.on(ServerEvents.ERROR, onError);
    return () => {
      socket.off(ServerEvents.ERROR, onError);
    };
  }, [game?.id, onSetErrorMsg, onSetIsCreatingOrJoining, router]);

  // Start game handler (Party Leader only, 2 players required)
  const handleStartGame = useCallback(() => {
    if (!party?.id || !isHost || !opponent?.id) return;

    setIsStartingGame(true);

    if (game?.id && game.status === "WAITING") {
      if (startedGameRef.current !== game.id) {
        startedGameRef.current = game.id;
        startGame();
      }
      return;
    }

    startedGameRef.current = null;
    const settings = useGameSettingsStore.getState();
    createGame({
      questionMode: settings.questionMode ?? "PRESET",
      timePerRound: settings.timer,
      maxNos: settings.maxNos,
      maxGuesses: settings.maxGuesses,
      questionCount: settings.questionCount,
    });
  }, [party?.id, isHost, opponent?.id, game?.id, game?.status]);

  return {
    handleStartGame,
    isStartingGame,
  };
}
