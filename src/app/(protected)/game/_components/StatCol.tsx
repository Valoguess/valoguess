import { cn } from "@/lib/utils";

export function StatCol({
  icon,
  label,
  val,
  valClass,
}: {
  icon: string;
  label: string;
  val: string;
  valClass?: string;
}) {
  return (
    <div className="flex flex-col items-center bg-[#0d1119]/60 border border-white/5 p-2.5 rounded-sm">
      <span className="text-base mb-1">{icon}</span>
      <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold text-center min-h-[1.75rem] flex items-center justify-center leading-tight">
        {label}
      </span>
      <span className={cn("text-sm font-black text-white mt-1 leading-none font-display", valClass)}>
        {val}
      </span>
    </div>
  );
}
