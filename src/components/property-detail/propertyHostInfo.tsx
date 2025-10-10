"use client";

import { Building2, Phone } from "lucide-react";

interface PropertyHostInfoProps {
  tenant: any;
}

export function PropertyHostInfo({ tenant }: PropertyHostInfoProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Hosted by</h3>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{tenant.name}</h4>
          <p className="text-sm text-gray-600">
            {tenant.tenantProfile.companyName}
          </p>
        </div>
      </div>

      {tenant.tenantProfile.phone && (
        <div className="flex items-center gap-3 text-gray-600 py-3 border-t border-gray-100">
          <Phone className="w-4 h-4 text-blue-600" />
          <span className="text-sm">{tenant.tenantProfile.phone}</span>
        </div>
      )}
    </div>
  );
}