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
    <div className="flex flex-col items-center bg-[#0d1119]/40 border border-white/[0.01] p-2 rounded-sm">
      <span className="text-base mb-0.5">{icon}</span>
      <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold text-center h-5 flex items-center justify-center leading-tight">
        {label}
      </span>
      <span className={cn("text-xs font-black text-white mt-0.5 leading-none font-display", valClass)}>
        {val}
      </span>
    </div>
  );
}
