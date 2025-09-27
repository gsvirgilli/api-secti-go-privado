import React, { useState, useRef } from "react";
import { Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  currentPhoto?: string | null;
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  onPhotoChange, 
  currentPhoto, 
  className 
}) => {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        onPhotoChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">Foto</label>
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300",
          preview ? "border-green-500" : ""
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
              onClick={removePhoto}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <User className="w-12 h-12 mx-auto text-gray-400" />
            <div className="text-sm text-gray-600">
              <p>Arraste uma foto aqui ou</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar arquivo
              </Button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
      
      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
      </p>
    </div>
  );
};

export { PhotoUpload };
