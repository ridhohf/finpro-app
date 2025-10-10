"use client";

import { Clock, Check, X } from "lucide-react";

interface PaymentProofStatusProps {
  booking: any;
}

export function PaymentProofStatus({ booking }: PaymentProofStatusProps) {
  if (!booking.paymentProofs || booking.paymentProofs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Payment Proof Status
      </h2>

      {booking.paymentProofs.map((proof: any) => (
        <div key={proof.id} className="space-y-4">
          <img
            src={proof.image}
            alt="Payment proof"
            className="w-full h-64 object-contain bg-gray-100 rounded-2xl"
          />

          {proof.isValid === null && (
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">Under Review</p>
                  <p className="text-sm text-yellow-700">
                    Your payment proof is being verified
                  </p>
                </div>
              </div>
            </div>
          )}

          {proof.isValid === true && (
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    Payment Verified
                  </p>
                  <p className="text-sm text-green-700">
                    Your payment has been confirmed
                  </p>
                </div>
              </div>
            </div>
          )}

          {proof.isValid === false && (
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">
                    Payment Rejected
                  </p>
                  {proof.rejectedReason && (
                    <p className="text-sm text-red-700">
                      Reason: {proof.rejectedReason}
                    </p>
                  )}
                  <p className="text-sm text-red-700 mt-2">
                    Please upload a new payment proof
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
