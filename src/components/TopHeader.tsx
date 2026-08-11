import { cn } from "@/lib/utils";
import Image from "next/image";

type TopHeaderProps = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export function TopHeader({
  title,
  subtitle,
  left,
  right,
  className,
}: TopHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-white/10 bg-[#090B11]",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,70,85,.08),transparent_65%)]" />

      {/* Top Accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="relative flex items-center justify-between px-8 py-6">
        {/* Left */}
        <div className="flex min-w-[220px] items-center">
          {left}
        </div>

        {/* Center */}
        <div className="relative flex flex-col items-center">
          {/* Decorative Side Lines */}
          <div className="pointer-events-none absolute top-1/2 flex w-[760px] -translate-y-1/2 items-center">
            {/* Left */}
            <div className="flex flex-1 items-center">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-accent" />
              <div className="mx-2 h-2 w-2 rotate-45 border border-accent/70 bg-[#090B11]" />
              <div className="h-px w-10 bg-accent" />
            </div>

            {/* Gap */}
            <div className="w-[360px]" />

            {/* Right */}
            <div className="flex flex-1 items-center">
              <div className="h-px w-10 bg-accent" />
              <div className="mx-2 h-2 w-2 rotate-45 border border-accent/70 bg-[#090B11]" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-accent" />
            </div>
          </div>

          {/* Logo Block */}
          <div className="relative z-10 flex items-center gap-5 bg-[#090B11] px-8">
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/25 blur-xl" />

              <Image
                src="/logo.svg"
                alt="Logo"
                width={42}
                height={42}
                className="relative"
              />
            </div>

            <div className="text-center">
              <h1 className="font-display text-[38px] font-black uppercase tracking-[0.12em] text-white">
                {title}
              </h1>

              {subtitle && (
                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="h-px w-10 bg-accent/60" />

                  <span className="font-display text-[11px] font-bold uppercase tracking-[0.45em] text-accent">
                    {subtitle}
                  </span>

                  <span className="h-px w-10 bg-accent/60" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Ornament */}
          <div className="mt-5 flex items-center">
            <div className="h-px w-40 bg-gradient-to-r from-transparent to-accent" />

            <div className="mx-4 relative">
              <div className="absolute inset-0 bg-accent blur-md opacity-50" />

              <div className="relative h-3 w-3 rotate-45 border border-accent bg-[#090B11]" />
            </div>

            <div className="h-px w-40 bg-gradient-to-l from-transparent to-accent" />
          </div>
        </div>

        {/* Right */}
        <div className="flex min-w-[220px] justify-end gap-3">
          {right}
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
}