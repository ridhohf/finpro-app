"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { reservationAPI } from "@/lib/api/reservation.api";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RejectDialogProps {
  bookingId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function RejectDialog({
  bookingId,
  onClose,
  onSuccess,
}: RejectDialogProps) {
  const { token } = useAuthStore();
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsProcessing(true);
    try {
      await reservationAPI.confirmPayment(
        bookingId,
        false,
        rejectReason.trim(),
        token!
      );
      toast.success("Payment rejected");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Payment</h3>
        <p className="text-gray-600 mb-4">
          Please provide a reason for rejecting this payment:
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
          placeholder="e.g., Payment amount doesn't match, unclear image, etc."
        />
        <div className="flex gap-3 mt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-xl border-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            disabled={isProcessing || !rejectReason.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}