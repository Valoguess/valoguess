import { cn } from "@/lib/utils";

export function SummaryRow({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-0">
      <div className="flex items-center gap-2">
        <div className="text-zinc-500 shrink-0">{icon}</div>
        <span className="text-xs text-zinc-400 font-medium">{label}</span>
      </div>
      <span className={cn("text-xs font-semibold text-white", valueClass)}>{value}</span>
    </div>
  );
}
