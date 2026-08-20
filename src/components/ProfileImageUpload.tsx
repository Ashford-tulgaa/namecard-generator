'use client';

import { useState, useRef } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { compressImage, validateImageFile } from '@/lib/image';

interface ProfileImageUploadProps {
  profileImage?: string;
  onImageChange: (imageDataUrl: string | null) => void;
}

export default function ProfileImageUpload({ profileImage, onImageChange }: ProfileImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      // Compress image for better performance
      const compressedImage = await compressImage(file, 400, 0.8);
      onImageChange(compressedImage);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try another file.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        <Camera className="inline w-4 h-4 mr-1" />
        Profile Photo
      </label>
      
      {profileImage ? (
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-gray-200 shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-3 w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
          >
            Change Photo
          </button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <button
                onClick={() => inputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Click to upload
              </button>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Recommended: Square image (1:1 ratio)</p>
        <p>• Optimal size: 400x400 pixels</p>
        <p>• Photo included in downloadable vCard file</p>
        <p>• Note: QR codes contain contact info without photo due to size limits</p>
      </div>
    </div>
  );
}