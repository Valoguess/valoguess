"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swords, Trophy, Shield, RefreshCw, Loader2, ArrowRight, Flame, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { getMatchHistoryAction, revalidateMatchHistoryAction, MatchHistoryCursor } from "@/actions/game";
import { MatchHistoryCard, MatchHistoryGame } from "./_components/MatchHistoryCard";
import { MatchHistorySkeleton } from "./_components/MatchHistorySkeleton";

export default function HistoryPage() {
  const { user } = useAuthStore();
  const [games, setGames] = useState<MatchHistoryGame[]>([]);
  const [nextCursor, setNextCursor] = useState<MatchHistoryCursor | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sentinel ref for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Initial Fetch
  const fetchInitialGames = useCallback(async () => {
    setIsLoadingInitial(true);
    setError(null);
    try {
      const res = await getMatchHistoryAction(undefined, 10);
      if (res.success && res.data) {
        setGames(res.data.items as MatchHistoryGame[]);
        setNextCursor(res.data.nextCursor);
        setHasMore(Boolean(res.data.nextCursor));
      } else {
        setError(res.error || "Failed to load match history");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load match history");
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialGames();
  }, [fetchInitialGames]);

  // Load More function
  const loadMoreGames = useCallback(async () => {
    if (!nextCursor || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const res = await getMatchHistoryAction(nextCursor, 10);
      if (res.success && res.data) {
        setGames((prev) => [...prev, ...(res.data!.items as MatchHistoryGame[])]);
        setNextCursor(res.data.nextCursor);
        setHasMore(Boolean(res.data.nextCursor));
      }
    } catch {
      // Keep state intact on failure
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore, hasMore]);

  // Infinite scroll intersection observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreGames();
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMoreGames, hasMore, isLoadingMore]);

  // Performance calculations
  const totalMatches = games.length;
  const wins = games.filter((g) => {
    const me = g.players.find((p) => p.userId === user?.id) || g.players[0];
    return me?.outcome === "WIN";
  }).length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  return (
    <div className="relative min-h-full w-full text-white flex flex-col font-body selection:bg-accent selection:text-white">
      {/* Background artwork */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg3.webp"
          alt="Background"
          fill
          priority
          quality={90}
          className="object-cover object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#040609]/90 via-[#040609]/80 to-[#040609]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,#040609_90%)]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Career Header & Performance Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-valorant text-xs uppercase tracking-[0.2em] text-accent flex items-center gap-1.5">
                <Swords className="h-3.5 w-3.5" /> PROTOCOL CAREER
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                // 1V1 TACTICAL MATCHES
              </span>
            </div>
            <h1 className="font-valorant text-2xl sm:text-3xl tracking-wider text-white">
              MATCH <span className="text-accent">HISTORY</span>
            </h1>
          </div>

          {/* Quick Stats Summary Badges */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-sm border border-white/10 bg-[#080B10]/80 backdrop-blur-md flex items-center gap-2.5">
              <Flame className="h-4 w-4 text-accent" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  WIN RATE
                </span>
                <span className="font-valorant text-sm text-white">
                  {winRate}%
                </span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-sm border border-white/10 bg-[#080B10]/80 backdrop-blur-md flex items-center gap-2.5">
              <Trophy className="h-4 w-4 text-mint" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  VICTORIES
                </span>
                <span className="font-valorant text-sm text-mint">
                  {wins} <span className="text-[10px] text-zinc-500 font-mono">/ {totalMatches}</span>
                </span>
              </div>
            </div>

            <button
              onClick={async () => {
                await revalidateMatchHistoryAction();
                fetchInitialGames();
              }}
              disabled={isLoadingInitial}
              className="p-2.5 rounded-sm border border-white/10 bg-[#080B10]/80 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Refresh match history"
            >
              <RefreshCw className={cn("h-4 w-4", isLoadingInitial && "animate-spin text-accent")} />
            </button>
          </div>
        </div>

        {/* Content Listing */}
        {isLoadingInitial ? (
          <MatchHistorySkeleton />
        ) : error ? (
          <div className="p-8 rounded-sm border border-accent/30 bg-[#FF4655]/10 text-center space-y-3">
            <Shield className="h-8 w-8 text-accent mx-auto" />
            <h3 className="font-valorant text-lg text-white tracking-wider">
              FAILED TO LOAD MATCH ARCHIVES
            </h3>
            <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => fetchInitialGames()}
              className="px-5 py-2 rounded-sm bg-accent text-white font-valorant text-xs uppercase tracking-widest hover:bg-accent-dim transition cursor-pointer"
            >
              RETRY CONNECTION
            </button>
          </div>
        ) : games.length === 0 ? (
          /* Empty State */
          <div className="p-12 sm:p-16 rounded-sm border border-white/10 bg-[#080B10]/60 backdrop-blur-md text-center flex flex-col items-center justify-center">
            <div className="h-20 w-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/30 mb-5">
              <Target className="h-10 w-10" />
            </div>
            <h2 className="font-valorant text-2xl tracking-wider text-white mb-2">
              NO COMBAT LOGS RECORDED
            </h2>
            <p className="text-xs text-zinc-400 max-w-md font-medium leading-relaxed mb-6 font-body">
              Your match archives are currently empty. Enter the lobby, create or join a party, and outsmart your first opponent in a 1v1 tactical deduction duel!
            </p>
            <Link
              href="/lobby"
              className="inline-flex items-center gap-2 px-7 py-3 bg-accent hover:bg-accent-dim text-white font-valorant text-xs uppercase tracking-widest rounded-sm shadow-[0_0_20px_rgba(255,70,85,0.4)] transition cursor-pointer"
            >
              <Swords className="h-4 w-4" />
              <span>DEPLOY TO LOBBY</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Match List */
          <div className="space-y-3">
            {games.map((game) => (
              <MatchHistoryCard
                key={game.id}
                game={game}
                currentUserId={user?.id}
              />
            ))}

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="h-4" />

            {/* Loading More Indicator */}
            {isLoadingMore && (
              <div className="py-6 flex items-center justify-center gap-2 text-zinc-400 font-valorant text-xs tracking-widest uppercase">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span>DECRYPTING OLDER COMBAT RECORDS...</span>
              </div>
            )}

            {/* End of Record Indicator */}
            {!hasMore && games.length > 0 && (
              <div className="py-8 text-center text-zinc-600 font-mono text-[11px] uppercase tracking-[0.25em]">
                // END OF COMBAT RECORD //
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
