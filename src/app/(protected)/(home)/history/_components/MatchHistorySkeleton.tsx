export function MatchHistorySkeleton() {
  return (
    <div className="space-y-3 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative rounded-sm border border-white/5 bg-[#080B10]/70 p-5 pl-6 flex items-center justify-between gap-4 animate-pulse overflow-hidden"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-white/10" />

          <div className="flex items-center gap-4">
            <div className="w-24 h-6 bg-white/10 rounded-xs" />
            <div className="w-16 h-4 bg-white/5 rounded-xs hidden sm:block" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-sm bg-white/10" />
              <div className="space-y-1.5 hidden sm:block">
                <div className="h-3 w-16 bg-white/10 rounded-xs" />
                <div className="h-3 w-10 bg-white/5 rounded-xs" />
              </div>
            </div>

            <div className="h-7 w-7 rounded-full bg-white/5" />

            <div className="flex items-center gap-3">
              <div className="space-y-1.5 text-right hidden sm:block">
                <div className="h-3 w-16 bg-white/10 rounded-xs" />
                <div className="h-3 w-10 bg-white/5 rounded-xs" />
              </div>
              <div className="h-12 w-12 rounded-sm bg-white/10" />
            </div>
          </div>

          <div className="h-6 w-20 bg-white/10 rounded-xs" />
        </div>
      ))}
    </div>
  );
}
