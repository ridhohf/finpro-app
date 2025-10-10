"use client";

import { Building2 } from "lucide-react";

interface PropertyAboutProps {
  property: any;
}

export function PropertyAbout({ property }: PropertyAboutProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-blue-600" />
        About This Property
      </h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {property.description}
      </p>
    </div>
  );
}