'use client';

import { useRef, useState } from 'react';
import { AlertCircle, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { compressImage, validateImageFile } from '@/lib/image';

interface ProfileImageUploadProps {
  profileImage?: string;
  onImageChange: (imageDataUrl: string | null) => void;
}

export default function ProfileImageUpload({ profileImage, onImageChange }: ProfileImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error ?? 'That image could not be used.');
      return;
    }

    setIsProcessing(true);
    try {
      onImageChange(await compressImage(file));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Failed to process image.');
    } finally {
      setIsProcessing(false);
      // Allow re-selecting the same file after an error.
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    setError(null);
    onImageChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {profileImage ? (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileImage}
            alt="Your profile photo"
            className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isProcessing}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-xl border border-dashed p-5 text-center transition-colors ${
            dragActive ? 'border-blue-400 bg-blue-50/60' : 'border-slate-300 bg-slate-50/60'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" aria-hidden="true" />
          ) : (
            <ImagePlus className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
          )}
          <p className="mt-2.5 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isProcessing}
              className="font-medium text-blue-600 transition-colors hover:text-blue-700 disabled:opacity-60"
            >
              Upload a photo
            </button>{' '}
            or drag it here
          </p>
          <p className="mt-1 text-xs text-slate-400">JPEG, PNG, GIF or WebP · up to 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {error && (
        <p role="alert" className="mt-2.5 flex items-start gap-1.5 text-xs text-red-600">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <p className="mt-2.5 text-xs text-slate-500">
        Cropped to a square automatically. Photos ship in the vCard file, not the QR code —
        QR codes can&apos;t hold an image.
      </p>
    </div>
  );
}
