"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { reservationAPI } from "@/lib/api/reservation.api";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

interface PaymentUploadSectionProps {
  booking: any;
  onUploadSuccess: () => void;
}

export function PaymentUploadSection({
  booking,
  onUploadSuccess,
}: PaymentUploadSectionProps) {
  const { token } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const canUploadPayment = booking.status === "PENDING_PAYMENT";

  if (!canUploadPayment) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPG and PNG files are allowed");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      await reservationAPI.uploadPaymentProof(booking.id, selectedFile, token!);
      toast.success("Payment proof uploaded successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
      onUploadSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload payment proof");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6 text-blue-600" />
        Upload Payment Proof
      </h2>

      <div className="bg-blue-50 rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-blue-900 mb-3">Bank Transfer Details:</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Bank Name</span>
            <span className="font-bold text-gray-900">Bank BCA</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Account Number</span>
            <span className="font-bold text-gray-900">1234567890</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Account Name</span>
            <span className="font-bold text-gray-900">
              {booking?.property?.tenant?.tenantProfile?.companyName ||
                "Property Owner"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-blue-200 pt-2 mt-2">
            <span className="text-sm text-gray-700">Amount to Transfer</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(Number(booking.totalPrice))}
            </span>
          </div>
        </div>
      </div>

      {previewUrl ? (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Payment proof preview"
              className="w-full h-64 object-contain bg-gray-100 rounded-2xl"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute top-2 right-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Payment Proof
              </>
            )}
          </Button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            id="payment-proof"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="payment-proof"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-700 font-semibold mb-1">
              Click to upload payment proof
            </p>
            <p className="text-sm text-gray-500">JPG or PNG, max 1MB</p>
          </label>
        </div>
      )}

      <div className="mt-4 bg-yellow-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Important:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Make sure the image is clear and readable</li>
              <li>Include transaction date and amount</li>
              <li>
                Verification may take up to 2-4 hours during business hours
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
