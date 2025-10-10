"use client";

import { AlertCircle } from "lucide-react";

export function ImportantNotice() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-6 border-2 border-orange-200">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-orange-700" />
        </div>
        <div>
          <h3 className="font-bold text-orange-900 mb-2">Important Notice</h3>
          <ul className="space-y-1 text-sm text-orange-800">
            <li>
              ⏰ Complete payment within <strong>1 hour</strong> or your booking
              will be automatically cancelled
            </li>
            <li>
              📧 You'll receive booking confirmation via email after payment
            </li>
            <li>❌ Cancellation only allowed before payment upload</li>
          </ul>
        </div>
      </div>
    </div>
  );
}