"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, Trash2, CheckCircle2, AlertCircle, Loader2, Sparkles, Lock } from "lucide-react";
import { uploadUserAvatar, removeUserAvatar } from "@/actions/upload";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface ProfileAvatarUploadCardProps {
  isAnonymous: boolean;
  defaultIconPath: string;
}

export function ProfileAvatarUploadCard({
  isAnonymous,
  defaultIconPath,
}: ProfileAvatarUploadCardProps) {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const currentAvatar = previewUrl || user?.image || defaultIconPath;
  const hasCustomAvatar = Boolean(previewUrl || user?.image);

  const handleFileSelect = async (file: File) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Only image files (JPG, PNG, WEBP, GIF) are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5 MB limit. Please select a smaller image.");
      return;
    }

    // Local instant preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await uploadUserAvatar(formData);

      if (!res.success || !res.url) {
        throw new Error(res.error || "Failed to upload avatar.");
      }

      // Update authStore
      if (user) {
        setUser({
          ...user,
          image: res.url,
        });
      }

      setPreviewUrl(res.url);
      setSuccessMessage("Avatar deployed and synced successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      setErrorMessage(err?.message || "Failed to upload avatar. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    if (isRemoving || isUploading) return;
    setErrorMessage("");
    setSuccessMessage("");
    setIsRemoving(true);

    try {
      await removeUserAvatar();
      if (user) {
        setUser({
          ...user,
          image: null,
        });
      }
      setPreviewUrl(null);
      setSuccessMessage("Custom avatar removed. Using default agent icon.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Avatar removal failed:", err);
      setErrorMessage(err?.message || "Failed to reset avatar.");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isAnonymous || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="bg-[#080B10]/70 border border-white/10 rounded-sm p-6 text-left space-y-5 relative overflow-hidden animate-fade-in shadow-xl">
      {/* Red Accent Header Edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-accent to-transparent" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-valorant text-sm tracking-wider text-white flex items-center gap-2">
              <Camera className="h-4 w-4 text-accent" /> PROFILE IMAGE / TACTICAL AVATAR
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-mint bg-mint/10 border border-mint/20 px-2 py-0.5 rounded">
              CLOUDINARY CDN
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Upload your custom avatar. Displayed across the lobby card, party matches, and friends sidebar.
          </p>
        </div>

        {isAnonymous && (
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FF4655] bg-[#FF4655]/10 px-2 py-0.5 rounded border border-[#FF4655]/30 flex items-center gap-1 shrink-0 self-start sm:self-center">
            <Lock className="h-3 w-3" /> GUEST LOCKED
          </span>
        )}
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="p-3 bg-[#FF4655]/10 border border-[#FF4655]/30 rounded text-xs text-[#FF4655] font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-mint/10 border border-mint/30 rounded text-xs text-mint font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Avatar Controls Row */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
        {/* Avatar Display Frame with Hover Overlay */}
        <div className="relative group shrink-0">
          <div
            className={cn(
              "relative h-24 w-24 rounded-sm overflow-hidden border-2 bg-black shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all",
              hasCustomAvatar ? "border-accent shadow-[0_0_20px_rgba(255,70,85,0.3)]" : "border-white/20"
            )}
          >
            <Image
              src={currentAvatar}
              alt="Avatar Preview"
              fill
              className="object-cover object-top"
              unoptimized={currentAvatar.startsWith("blob:")}
            />

            {/* Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-1">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
                <span className="text-[8px] font-mono uppercase tracking-wider text-white/80">SYNCING</span>
              </div>
            )}

            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-mint rounded-tl-sm border-t border-l border-black shadow-[0_0_8px_#3cf2c4]" />
          </div>

          {!isAnonymous && !isUploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex flex-col items-center justify-center text-white gap-1 cursor-pointer"
              title="Click to change avatar"
            >
              <Camera className="h-5 w-5 text-accent" />
              <span className="text-[8px] font-mono font-bold tracking-wider uppercase">CHANGE</span>
            </button>
          )}
        </div>

        {/* Dropzone & Action Buttons */}
        <div className="flex-1 w-full space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!isAnonymous && !isUploading) setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => {
              if (!isAnonymous && !isUploading) fileInputRef.current?.click();
            }}
            className={cn(
              "border-2 border-dashed rounded-sm p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5",
              isAnonymous
                ? "border-white/10 bg-white/[0.01] opacity-50 cursor-not-allowed"
                : isDragOver
                ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(255,70,85,0.2)]"
                : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={isAnonymous || isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />

            <Upload className={cn("h-5 w-5", isDragOver ? "text-accent" : "text-white/40")} />

            <div>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-white">
                {isUploading ? "Uploading to Cloudinary CDN..." : "Choose Image File or Drag & Drop"}
              </span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">
                PNG, JPG, WEBP, or GIF up to 5 MB (Auto-cropped to 500x500 square)
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isAnonymous || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>UPLOADING...</span>
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 text-accent" />
                  <span>UPLOAD NEW IMAGE</span>
                </>
              )}
            </button>

            {hasCustomAvatar && !isAnonymous && (
              <button
                type="button"
                disabled={isRemoving || isUploading}
                onClick={handleRemove}
                className="py-2 px-3.5 bg-transparent hover:bg-[#FF4655]/15 border border-white/10 hover:border-[#FF4655]/40 text-zinc-400 hover:text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                title="Reset to default agent icon"
              >
                {isRemoving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                <span>RESET TO DEFAULT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
