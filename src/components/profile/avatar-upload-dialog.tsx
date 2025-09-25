"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileApi } from "@/lib/api";
import { Upload, X, Camera } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadDialogProps {
  currentAvatar?: string;
  onAvatarUpdate: () => void;
  children: React.ReactNode;
}

export default function AvatarUploadDialog({
  currentAvatar,
  onAvatarUpdate,
  children,
}: AvatarUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPG, JPEG, PNG, or GIF)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 1MB";
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error("Invalid file", { description: error });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsLoading(true);

    try {
      await profileApi.updateAvatar(selectedFile);

      toast.success("Avatar updated successfully");
      onAvatarUpdate();
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error("Failed to update avatar", {
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current/Preview Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={preview || currentAvatar}
                alt="Profile picture"
              />
              <AvatarFallback className="bg-gray-100">
                <Camera className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>

            {preview && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Remove Selected
              </Button>
            )}
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Photo
            </Button>

            <div className="text-xs text-gray-500 text-center">
              Supported formats: JPG, JPEG, PNG, GIF
              <br />
              Maximum size: 1MB
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? "Uploading..." : "Update Photo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
