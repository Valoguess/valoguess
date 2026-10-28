"use client";

import Image from "next/image";

export function AuthBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none">
      <Image
        src="/bg/bg4.webp"
        alt="ValoGuess Auth Background"
        fill
        priority
        quality={100}
        className="object-cover object-center scale-[1.01]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#040609] via-[#040609]/70 to-[#040609]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#040609_90%)]" />
    </div>
  );
}
