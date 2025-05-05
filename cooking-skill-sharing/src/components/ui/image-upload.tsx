import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  maxFiles?: number;
  onUpload: (urls: string[]) => void;
}

export const ImageUpload = ({ maxFiles = 3, onUpload }: ImageUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        toast({
          title: 'Error',
          description: `You can only upload up to ${maxFiles} images.`,
          variant: 'destructive',
        });
        return;
      }

      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);

      // TODO: Implement actual file upload to server/storage
      // For now, we'll just simulate the upload with the local URLs
      onUpload([...previews, ...newPreviews]);
    },
    [files, maxFiles, onUpload, previews, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: maxFiles - files.length,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onUpload(newPreviews);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isDragActive
              ? 'Drop the images here'
              : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: JPEG, PNG, GIF
          </p>
          <p className="text-sm text-gray-500">
            Maximum {maxFiles} images allowed
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 