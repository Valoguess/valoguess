export function MatchHistorySkeleton() {
  return (
    <div className="space-y-3 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative rounded-sm border border-white/10 bg-[#080b10]/80 p-3.5 sm:p-4 pl-4.5 sm:pl-5 flex items-center justify-between gap-4 animate-pulse overflow-hidden"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-white/10" />

          <div className="flex items-center gap-4">
            <div className="w-20 sm:w-24 h-5 sm:h-6 bg-white/10 rounded-sm" />
            <div className="w-16 h-4 bg-white/5 rounded-sm hidden sm:block" />
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-sm bg-white/10" />
              <div className="space-y-1.5 hidden sm:block">
                <div className="h-3 w-16 bg-white/10 rounded-sm" />
                <div className="h-3 w-10 bg-white/5 rounded-sm" />
              </div>
            </div>

            <div className="w-5 h-5 rotate-45 bg-white/5 border border-white/10 shrink-0" />

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="space-y-1.5 text-right hidden sm:block">
                <div className="h-3 w-16 bg-white/10 rounded-sm" />
                <div className="h-3 w-10 bg-white/5 rounded-sm" />
              </div>
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-sm bg-white/10" />
            </div>
          </div>

          <div className="h-6 w-16 sm:w-20 bg-white/10 rounded-sm" />
        </div>
      ))}
    </div>
  );
}
