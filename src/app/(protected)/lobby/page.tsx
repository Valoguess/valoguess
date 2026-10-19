import { Suspense } from "react";
import { LobbyClient } from "./_components/LobbyClient";

export const instant = false;

export default function LobbyPage() {
  return (
    <Suspense fallback={null}>
      <LobbyClient />
    </Suspense>
  );
}
