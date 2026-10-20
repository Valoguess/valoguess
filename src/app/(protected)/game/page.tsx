"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PartyChatOverlay } from "@/components/chat/PartyChatOverlay";
import { useResultData } from "./_hooks/useResultData";
import { ResultHeader } from "./_components/ResultHeader";
import { ResultProfileSidebar } from "./_components/ResultProfileSidebar";
import { ResultFaceOff } from "./_components/ResultFaceOff";
import { ResultTimelineSidebar } from "./_components/ResultTimelineSidebar";
import { ResultFooter } from "./_components/ResultFooter";

function GameResultContent() {
  const {
    clearGame,
    myAgentObj,
    oppAgentObj,
    userName,
    oppName,
    isVictory,
    isTie,
    isDefeat,
    roundsPlayed,
    totalQuestions,
    maxNos,
    userNosUsed,
    opponentNosUsed,
    guessesMade,
    accuracy,
    timeTaken,
    timeline,
  } = useResultData();

  return (
    <main className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-base-950 text-white select-none flex flex-col font-body">
      {/* 1. Top Header Navigation */}
      <ResultHeader onBackToLobby={() => clearGame()} />

      {/* 2. Main Grid Content: Left Sidebar, Center Face-Off, Right Timeline */}
      <div className="flex-1 p-3 sm:p-5 flex flex-col xl:grid xl:grid-cols-[280px_1fr_320px] gap-5 max-w-[1600px] mx-auto w-full">
        {/* Left Profile & Stats (Order 2 on mobile, Order 1 on desktop) */}
        <div className="order-2 xl:order-1">
          <ResultProfileSidebar
            userName={userName}
            myAgentObj={myAgentObj}
            isVictory={isVictory}
            isTie={isTie}
            oppName={oppName}
            oppAgentObj={oppAgentObj}
            totalQuestions={totalQuestions}
            userNosUsed={userNosUsed}
            maxNos={maxNos}
            guessesMade={guessesMade}
            timeTaken={timeTaken}
            roundsPlayed={roundsPlayed}
          />
        </div>

        {/* Center Result Face-Off (Order 1 on mobile, Order 2 on desktop) */}
        <div className="order-1 xl:order-2">
          <ResultFaceOff
            isVictory={isVictory}
            isTie={isTie}
            isDefeat={isDefeat}
            userName={userName}
            oppName={oppName}
            myAgentObj={myAgentObj}
            oppAgentObj={oppAgentObj}
            roundsPlayed={roundsPlayed}
            totalQuestions={totalQuestions}
            userNosUsed={userNosUsed}
            opponentNosUsed={opponentNosUsed}
            guessesMade={guessesMade}
            accuracy={accuracy}
          />
        </div>

        {/* Right Match Timeline (Order 3) */}
        <div className="order-3">
          <ResultTimelineSidebar
            timeline={timeline}
            userName={userName}
            oppName={oppName}
          />
        </div>
      </div>

      {/* 3. Footer Navigation Buttons */}
      <ResultFooter onBackToLobby={() => clearGame()} />

      {/* 4. In-Game Party Chat Overlay */}
      <PartyChatOverlay className="bottom-20 left-4 sm:left-6" />
    </main>
  );
}

export default function GameResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base-950 flex flex-col items-center justify-center text-white">
          <Loader2 className="h-10 w-10 text-accent animate-spin" />
          <span className="text-xs text-ink-500 uppercase tracking-widest mt-4 font-display">
            Loading Match Results...
          </span>
        </div>
      }
    >
      <GameResultContent />
    </Suspense>
  );
}
