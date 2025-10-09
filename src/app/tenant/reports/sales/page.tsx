'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Download,
  Calendar,
  Building2,
} from 'lucide-react';
import { reportAPI } from '@/lib/api/report.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { withAuth } from '@/lib/hoc/withAuth';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/utils/date';
import { toast } from 'sonner';
import type { SalesReport } from '@/types/report.types';

function SalesReportPage() {
  const { user, token } = useAuthStore();

  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'property'>('date');

  useEffect(() => {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadReport();
    }
  }, [startDate, endDate, sortBy]);

  const loadReport = async () => {
    if (!token || !user?.id) return;

    setIsLoading(true);
    try {
      const response = await reportAPI.getSalesReport(user.id, token, {
        startDate,
        endDate,
        sortBy,
      });

      setReport(response.data || null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat laporan penjualan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    toast.info('Fitur export akan segera tersedia');
  };

  if (isLoading && !report) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Memuat laporan...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Laporan Penjualan
          </h1>
          <p className="text-gray-600">
            Analisis pendapatan dan transaksi properti Anda
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Tanggal Mulai
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Tanggal Akhir
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Urutkan
              </label>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Tanggal</SelectItem>
                  <SelectItem value="price">Harga</SelectItem>
                  <SelectItem value="property">Properti</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleExport}
                variant="outline"
                className="w-full rounded-xl border-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary Cards */}
        {report && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 border-2 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">
                      Total Transaksi
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {report.summary.totalTransactions}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">
                      Total Pendapatan
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(report.summary.totalRevenue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">
                      Rata-rata Booking
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(report.summary.averageBookingValue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            {/* By Property */}
            {report.byProperty.length > 0 && (
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-purple-600" />
                  Pendapatan Per Properti
                </h2>
                <div className="space-y-4">
                  {report.byProperty.map((prop, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {prop.propertyName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {prop.bookings} booking(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {formatCurrency(prop.revenue)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Avg: {formatCurrency(prop.revenue / prop.bookings)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Transactions Table */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Detail Transaksi
              </h2>

              {report.transactions.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Tidak ada transaksi dalam periode ini
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Booking ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Tanggal
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Properti
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Tamu
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Check-in
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Durasi
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm font-mono text-gray-600">
                            #{transaction.id.toString().padStart(6, '0')}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {formatDate(transaction.bookingDate)}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                            {transaction.property}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {transaction.guest}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(transaction.checkIn)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {transaction.duration} malam
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-right text-green-600">
                            {formatCurrency(transaction.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default withAuth(SalesReportPage, {
  requireAuth: true,
  requiredRole: 'tenant',
  requireVerified: true,
});
