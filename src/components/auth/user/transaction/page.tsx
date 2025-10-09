'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { TransactionCard } from '@/components/transaction/TransactionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Filter, Calendar } from 'lucide-react';
import { transactionAPI } from '@/lib/api/transaction.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { withAuth } from '@/lib/hoc/withAuth';
import { toast } from 'sonner';
import type { Transaction, TransactionStatus } from '@/types/transaction.types';

function UserTransactionsPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, statusFilter]);

  const loadTransactions = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await transactionAPI.getAllTransactions(token);
      setTransactions(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat data transaksi');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Filter by search query (property name or booking ID)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.property?.name.toLowerCase().includes(query) ||
          t.id.toString().includes(query)
      );
    }

    setFilteredTransactions(filtered);
  };

  const getStatusCount = (status: TransactionStatus) => {
    return transactions.filter((t) => t.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Memuat transaksi...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Riwayat Booking
          </h1>
          <p className="text-gray-600">
            Kelola dan pantau semua booking Anda di sini
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl border-2 transition-all ${
              statusFilter === 'all'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className="text-sm text-gray-600 mb-1">Semua</p>
            <p className="text-2xl font-bold text-gray-900">
              {transactions.length}
            </p>
          </button>

          <button
            onClick={() => setStatusFilter('PENDING_PAYMENT')}
            className={`p-4 rounded-2xl border-2 transition-all ${
              statusFilter === 'PENDING_PAYMENT'
                ? 'bg-yellow-50 border-yellow-500'
                : 'bg-white border-gray-200 hover:border-yellow-300'
            }`}
          >
            <p className="text-sm text-gray-600 mb-1">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-600">
              {getStatusCount('PENDING_PAYMENT')}
            </p>
          </button>

          <button
            onClick={() => setStatusFilter('PENDING_CONFIRMATION')}
            className={`p-4 rounded-2xl border-2 transition-all ${
              statusFilter === 'PENDING_CONFIRMATION'
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className="text-sm text-gray-600 mb-1">Konfirmasi</p>
            <p className="text-2xl font-bold text-blue-600">
              {getStatusCount('PENDING_CONFIRMATION')}
            </p>
          </button>

          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`p-4 rounded-2xl border-2 transition-all ${
              statusFilter === 'CONFIRMED'
                ? 'bg-green-50 border-green-500'
                : 'bg-white border-gray-200 hover:border-green-300'
            }`}
          >
            <p className="text-sm text-gray-600 mb-1">Dikonfirmasi</p>
            <p className="text-2xl font-bold text-green-600">
              {getStatusCount('CONFIRMED')}
            </p>
          </button>

          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`p-4 rounded-2xl border-2 transition-all ${
              statusFilter === 'COMPLETED'
                ? 'bg-gray-50 border-gray-500'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-sm text-gray-600 mb-1">Selesai</p>
            <p className="text-2xl font-bold text-gray-600">
              {getStatusCount('COMPLETED')}
            </p>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Cari nama properti atau booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-2 h-12"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-xl border-2 h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PENDING_PAYMENT">
                  Menunggu Pembayaran
                </SelectItem>
                <SelectItem value="PENDING_CONFIRMATION">
                  Menunggu Konfirmasi
                </SelectItem>
                <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tidak ada transaksi
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Tidak ditemukan transaksi dengan filter tersebut'
                  : 'Anda belum memiliki transaksi. Mulai booking sekarang!'}
              </p>
              <Button
                onClick={() => router.push('/properties')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
              >
                Cari Properti
              </Button>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                viewType="user"
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default withAuth(UserTransactionsPage, {
  requireAuth: true,
  requiredRole: 'user',
  requireVerified: true,
});
