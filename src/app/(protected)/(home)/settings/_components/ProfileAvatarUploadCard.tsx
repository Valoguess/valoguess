"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, Trash2, Loader2, Lock } from "lucide-react";
import { uploadUserAvatar, removeUserAvatar } from "@/actions/user";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageCropModal } from "./ImageCropModal";

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
  const [isDragOver, setIsDragOver] = useState(false);

  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedRawFile, setSelectedRawFile] = useState<File | null>(null);

  const currentAvatar = previewUrl || user?.image || defaultIconPath;
  const hasCustomAvatar = Boolean(previewUrl || user?.image);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files (JPG, PNG, WEBP, GIF) are allowed.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File exceeds 15 MB limit. Please select a smaller image.");
      return;
    }

    setSelectedRawFile(file);
    setShowCropModal(true);
  };

  const uploadCroppedFile = async (croppedFile: File) => {
    const localUrl = URL.createObjectURL(croppedFile);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", croppedFile);

      const res = await uploadUserAvatar(formData);

      if (!res.success || !res.url) {
        throw new Error(res.error || "Failed to upload avatar.");
      }

      if (user) {
        setUser({
          ...user,
          image: res.url,
        });
      }

      setPreviewUrl(res.url);
      toast.success("Avatar updated successfully!");
    } catch (err: any) {
      const msg = err?.message || "Failed to upload avatar. Please try again.";
      toast.error(msg);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      setSelectedRawFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    if (isRemoving || isUploading) return;
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
      toast.info("Custom avatar removed. Using default agent icon.");
    } catch (err: any) {
      const msg = err?.message || "Failed to reset avatar.";
      toast.error(msg);
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
    <div className="bg-[#080b10]/75 border border-white/10 rounded-sm p-5 sm:p-6 text-left space-y-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="font-valorant text-xs sm:text-sm tracking-wider text-white flex items-center gap-2">
            <Camera className="h-4 w-4 text-[#FF4655]" /> PROFILE AVATAR
          </span>
          <p className="text-xs text-white/50 leading-relaxed font-sans">
            Upload a custom avatar shown across match lobbies, podiums, and friend lists.
          </p>
        </div>

        {isAnonymous && (
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FF4655] bg-[#FF4655]/10 px-2 py-0.5 rounded-xs border border-[#FF4655]/30 flex items-center gap-1 shrink-0 self-start sm:self-center">
            <Lock className="h-3 w-3" /> GUEST LOCKED
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
        <div className="relative group shrink-0">
          <div className="relative h-24 w-24 rounded-full bg-black border border-white/20 overflow-hidden shadow-md">
            <Image
              src={currentAvatar}
              alt="Avatar Preview"
              fill
              sizes="96px"
              className="object-cover object-center rounded-full"
              unoptimized={currentAvatar.startsWith("blob:")}
            />

            {isUploading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white space-y-1">
                <Loader2 className="h-6 w-6 animate-spin text-[#FF4655]" />
                <span className="text-[8px] font-mono uppercase tracking-wider text-white/80">SAVING</span>
              </div>
            )}

            <div className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-mint rounded-full border border-black" />
          </div>

          {!isAnonymous && !isUploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex flex-col items-center justify-center text-white gap-1 cursor-pointer"
              title="Click to change avatar"
            >
              <Camera className="h-5 w-5 text-[#FF4655]" />
              <span className="text-[8px] font-mono font-bold tracking-wider uppercase">CHANGE</span>
            </button>
          )}
        </div>

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
              "border border-dashed rounded-sm p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5",
              isAnonymous
                ? "border-white/10 bg-white/[0.01] opacity-50 cursor-not-allowed"
                : isDragOver
                ? "border-[#FF4655] bg-[#FF4655]/10"
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

            <Upload className={cn("h-5 w-5", isDragOver ? "text-[#FF4655]" : "text-white/40")} />

            <div>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-white">
                {isUploading ? "Uploading..." : "Click to select or drag and drop image"}
              </span>
              <span className="text-[10px] text-white/40 font-mono block mt-0.5">
                PNG, JPG, WEBP, or GIF up to 5 MB
              </span>
            </div>
          </div>

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
                  <Upload className="h-3.5 w-3.5 text-[#FF4655]" />
                  <span>SELECT IMAGE</span>
                </>
              )}
            </button>

            {hasCustomAvatar && !isAnonymous && (
              <button
                type="button"
                disabled={isRemoving || isUploading}
                onClick={handleRemove}
                className="py-2 px-3.5 bg-transparent hover:bg-[#FF4655]/15 border border-white/10 hover:border-[#FF4655]/40 text-white/50 hover:text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
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

      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageFile={selectedRawFile}
        onApplyCrop={uploadCroppedFile}
      />
    </div>
  );
}
