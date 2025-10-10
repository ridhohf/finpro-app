"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { reportAPI } from "@/lib/api/report.api";
import { tenantAPI } from "@/lib/api/tenant.api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ReportsHeader } from "@/components/tenant/reports/reportHeader";
import { ReportFilters } from "@/components/tenant/reports/reportFilter";
import { ReportSummary } from "@/components/tenant/reports/reportSummary";
import { ReportTable } from "@/components/tenant/reports/reportTable";
import { PropertyBreakdown } from "@/components/tenant/reports/propertyBreakdown";

export default function TenantReportsPage() {
  const { token } = useAuthStore();
  const [reportData, setReportData] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    propertyId: "",
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await tenantAPI.getProperties({}, token!);
      if (response.data) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Failed to load properties:", error);
    }
  };

  const loadReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error("Please select date range");
      return;
    }

    setIsLoading(true);
    try {
      const response = await reportAPI.getSalesReport(
        token!,
        filters.startDate,
        filters.endDate,
        filters.propertyId ? parseInt(filters.propertyId) : undefined
      );

      if (response.data) {
        setReportData(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ReportsHeader />

      <ReportFilters
        filters={filters}
        properties={properties}
        isLoading={isLoading}
        onFilterChange={setFilters}
        onGenerate={loadReport}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      )}

      {reportData && !isLoading && (
        <>
          <ReportSummary reportData={reportData} />
          <ReportTable reportData={reportData} />
          {reportData.byProperty && reportData.byProperty.length > 0 && (
            <PropertyBreakdown
              breakdown={reportData.byProperty}
              totalRevenue={reportData.totalRevenue}
            />
          )}
        </>
      )}
    </div>
  );
}
