"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4 text-[#3CF2C4]" />,
        info: <InfoIcon className="size-4 text-sky-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-[#FF4655]" />,
        loading: <Loader2Icon className="size-4 animate-spin text-[#3CF2C4]" />,
      }}
      style={
        {
          "--normal-bg": "#0b0e14",
          "--normal-text": "#ffffff",
          "--normal-border": "rgba(255, 255, 255, 0.12)",
          "--border-radius": "4px",
          "--success-bg": "#061a14",
          "--success-border": "rgba(60, 242, 196, 0.4)",
          "--success-text": "#3CF2C4",
          "--error-bg": "#1c090c",
          "--error-border": "rgba(255, 70, 85, 0.45)",
          "--error-text": "#FF4655",
          "--warning-bg": "#1c1407",
          "--warning-border": "rgba(245, 158, 11, 0.45)",
          "--warning-text": "#fbbf24",
          "--info-bg": "#081626",
          "--info-border": "rgba(56, 189, 248, 0.45)",
          "--info-text": "#38bdf8",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group font-body text-xs backdrop-blur-xl border shadow-[0_8px_30px_rgba(0,0,0,0.7)] select-none",
          success:
            "!bg-[#061a14]/95 !border-[#3CF2C4]/45 !text-[#3CF2C4] shadow-[0_0_20px_rgba(60,242,196,0.18)]",
          error:
            "!bg-[#1c090c]/95 !border-[#FF4655]/50 !text-[#FF4655] shadow-[0_0_20px_rgba(255,70,85,0.22)]",
          warning:
            "!bg-[#1c1407]/95 !border-amber-400/50 !text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.18)]",
          info:
            "!bg-[#081626]/95 !border-sky-400/50 !text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.18)]",
          title: "font-semibold tracking-wide text-xs",
          description: "text-[11px] opacity-85",
          actionButton:
            "bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-2.5 py-1 rounded transition",
          cancelButton:
            "bg-white/5 hover:bg-white/10 text-white/70 font-medium text-xs px-2.5 py-1 rounded transition",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
export { toast } from "sonner"
