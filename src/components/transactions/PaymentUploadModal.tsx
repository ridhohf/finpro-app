'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  transactionId: number;
}

export function PaymentUploadModal({
  isOpen,
  onClose,
  onUpload,
  transactionId,
}: PaymentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file harus .jpg, .jpeg, atau .png');
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      toast.error('Ukuran file maksimal 1MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      toast.success('Bukti pembayaran berhasil diupload!');
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Gagal upload bukti pembayaran');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Upload Bukti Pembayaran
          </DialogTitle>
          <DialogDescription>
            Upload bukti transfer pembayaran Anda. Format: .jpg, .jpeg, .png
            (Maks. 1MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Upload Area */}
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="mb-2 text-sm text-gray-700 font-semibold">
                  Klik untuk upload bukti bayar
                </p>
                <p className="text-xs text-gray-500">
                  JPG, JPEG, atau PNG (MAX. 1MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-contain rounded-2xl border-2 border-gray-200"
              />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {selectedFile && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <FileImage className="w-4 h-4" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="text-gray-400">
                    ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Perhatian:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Pastikan bukti transfer jelas dan dapat dibaca</li>
                <li>Nominal transfer harus sesuai dengan total pembayaran</li>
                <li>Bukti pembayaran akan diverifikasi oleh tenant</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
            className="flex-1 rounded-xl"
          >
            Batal
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
