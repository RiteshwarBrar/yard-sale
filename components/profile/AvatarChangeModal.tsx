"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { X, Camera, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { nanoid } from 'nanoid';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Supabase user ID — used as the storage folder name */
  userId: string;
  /** Pre-initialised Supabase client */
  /** Current avatar URL (or null if none) */
  currentAvatarUrl?: string | null;
  /** User initials shown when no avatar is set, e.g. "JD" */
  initials?: string;
  /** Called with the new public URL after a successful upload */
  onSuccess?: (publicUrl: string) => void;
}

type Status = { msg: string; type: "success" | "error" | "" };

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Only PNG, JPG, and WEBP files are allowed.";
  if (file.size > MAX_FILE_SIZE) return "File must be under 1 MB.";
  return null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AvatarChangeModal({
  isOpen,
  onClose,
  userId,
  currentAvatarUrl,
  initials = "??",
  onSuccess,
}: AvatarChangeModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<Status>({ msg: "", type: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  // ── File handling ────────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setStatus({ msg: error, type: "error" });
      return;
    }
    setSelectedFile(file);
    setStatus({ msg: "", type: "" });
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setStatus({ msg: "", type: "" });
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleClose = useCallback(() => {
    clearFile();
    onClose();
  }, [clearFile, onClose]);

  // ── Drag & drop ──────────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // ── Upload ───────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!selectedFile || !userId) return;
    setUploading(true);
    setProgress(0);
    setStatus({ msg: "", type: "" });

    try {
      const ext = selectedFile.name.split(".").pop();
      const path = `${userId}/${nanoid()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, selectedFile, { upsert: true });

      console.log("Upload error:", uploadError);

      if (uploadError) throw uploadError;

      // Supabase doesn't stream upload progress natively via the JS client,
      // so we animate the bar to 100 after a successful upload.
      setProgress(100);

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);

      await supabase
        .from("users")
        .update({ avatar_url: data.publicUrl })
        .eq("id", userId);

      setStatus({ msg: "Profile picture updated successfully.", type: "success" });
      onSuccess?.(data.publicUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setStatus({ msg, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  // ── Keyboard trap (basic) ────────────────────────────────────────────────

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  if (!isOpen) return null;

  const avatarSrc = preview ?? currentAvatarUrl;
  const isDisabled = !selectedFile || uploading;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleOverlayKeyDown}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">

        {/* ── Header ── */}
        <div className="mb-6 flex items-center justify-between">
          <h2 id="modal-title" className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            Change profile picture
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
          >
            <XIcon />
          </button>
        </div>

        {/* ── Avatar preview ── */}
        <div className="mb-6 flex justify-center">
          <div className="relative h-[88px] w-[88px]">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="Avatar preview"
                fill
                className="rounded-full border border-black/10 object-cover dark:border-white/10"
                unoptimized={!!preview} // preview is a data URL; skip Next.js optimisation
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border border-black/10 bg-blue-100 text-2xl font-medium text-blue-700 dark:border-white/10 dark:bg-blue-900 dark:text-blue-300">
                {initials}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload new photo"
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-black/15 bg-white shadow-sm transition hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800"
            >
              <CameraIcon />
            </button>
          </div>
        </div>

        {/* ── Drop zone / file preview ── */}
        {!selectedFile ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload a new photo"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            className={[
              "flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 transition",
              isDragging
                ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950"
                : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
            ].join(" ")}
          >
            <UploadIcon />
            <p className="text-center text-[13px] text-neutral-500 dark:text-neutral-400">
              Drop image here or{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">browse</span>
            </p>
            <p className="text-[12px] text-neutral-400 dark:text-neutral-500">
              PNG, JPG, WEBP — max 1 MB
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-lg border border-black/8 bg-neutral-50 px-3 py-2.5 dark:border-white/8 dark:bg-neutral-800">
            {preview && (
              <Image
                src={preview}
                alt="Selected file"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-md object-cover"
                unoptimized
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
                {selectedFile.name}
              </p>
              <p className="text-[12px] text-neutral-400">{formatBytes(selectedFile.size)}</p>
            </div>
            <button
              onClick={clearFile}
              aria-label="Remove selected file"
              className="rounded p-0.5 text-neutral-400 transition hover:text-red-500"
            >
              <XIcon size={15} />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {/* ── Progress bar ── */}
        {uploading && (
          <div className="mt-3 flex flex-col gap-1.5">
            <p className="text-[12px] text-neutral-500">
              {progress < 100 ? "Uploading…" : "Finalising…"}
            </p>
            <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full bg-blue-500 transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Status message ── */}
        {status.msg && (
          <p
            aria-live="polite"
            className={[
              "mt-2 text-center text-[13px]",
              status.type === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400",
            ].join(" ")}
          >
            {status.msg}
          </p>
        )}

        {/* ── Footer ── */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isDisabled}
            className="flex-[2] rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {uploading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Icons (lucide-react) ─────────────────────────────────────────────────────

function XIcon({ size = 16 }: { size?: number }) {
  return <X size={size} aria-hidden="true" />;
}

function CameraIcon() {
  return <Camera size={14} aria-hidden="true" />;
}

function UploadIcon() {
  return <Upload size={22} className="text-neutral-400" aria-hidden="true" />;
}
