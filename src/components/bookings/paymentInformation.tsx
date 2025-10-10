"use client";

import { CreditCard, Info } from "lucide-react";

interface PaymentInformationProps {
  property: any;
}

export function PaymentInformation({ property }: PaymentInformationProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-blue-600" />
        Payment Information
      </h2>

      <div className="bg-blue-50 rounded-2xl p-6 mb-6">
        <p className="text-sm text-gray-700 mb-4">
          <strong>Transfer to:</strong>
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Bank BCA</span>
            <span className="font-bold text-gray-900">1234567890</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Account Name</span>
            <span className="font-bold text-gray-900">
              {property.tenant.tenantProfile.companyName}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-green-900">After Payment</h3>
        </div>
        <p className="text-sm text-green-800">
          Upload your payment proof on the booking detail page. Our team will
          verify your payment within 2-4 hours.
        </p>
      </div>
    </div>
  );
}