'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { TransactionStatusBadge } from '@/components/transactions/TransactionStatusBadge';
import { PaymentUploadModal } from '@/components/transactions/PaymentUploadModal';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Calendar,
  Bed,
  Upload,
  XCircle,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { transactionAPI } from '@/lib/api/transaction.api';
import { reviewAPI } from '@/lib/api/review.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { withAuth } from '@/lib/hoc/withAuth';
import { formatCurrency } from '@/lib/currency';
import { formatDate, getRelativeTime, isPastDate } from '@/lib/utils/date';
import { toast } from 'sonner';
import type { Transaction } from '@/types/transaction.types';

function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const transactionId = parseInt(params.id as string);

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadTransactionDetail();
  }, [transactionId]);

  const loadTransactionDetail = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await transactionAPI.getTransactionById(
        transactionId,
        token
      );
      setTransaction(response.data || null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat detail transaksi');
      router.push('/user/transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPayment = async (file: File) => {
    if (!token) return;

    await transactionAPI.uploadPaymentProof(transactionId, file, token);
    await loadTransactionDetail();
  };

  const handleCancelTransaction = async () => {
    if (!token) return;

    if (!confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
      return;
    }

    setIsCancelling(true);
    try {
      await transactionAPI.cancelTransaction(
        transactionId,
        'Dibatalkan oleh user',
        token
      );
      toast.success('Booking berhasil dibatalkan');
      await loadTransactionDetail();
    } catch (error: any) {
      toast.error(error.message || 'Gagal membatalkan booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!token) return;

    await reviewAPI.submitReview(transactionId, { rating, comment }, token);
    setShowReviewForm(false);
    await loadTransactionDetail();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!transaction) {
    return null;
  }

  const canCancel = transaction.status === 'PENDING_PAYMENT';
  const canUploadPayment =
    transaction.status === 'PENDING_PAYMENT' ||
    (transaction.status === 'PENDING_CONFIRMATION' &&
      transaction.paymentProofs &&
      transaction.paymentProofs.length > 0 &&
      !transaction.paymentProofs[transaction.paymentProofs.length - 1].isValid);
  const canReview =
    transaction.status === 'COMPLETED' &&
    isPastDate(transaction.checkOut) &&
    !showReviewForm;

  const latestPaymentProof =
    transaction.paymentProofs && transaction.paymentProofs.length > 0
      ? transaction.paymentProofs[transaction.paymentProofs.length - 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/user/transactions')}
          className="mb-6 hover:bg-white rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-8 border-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Detail Booking
                  </h1>
                  <p className="text-gray-600">
                    Booking ID: #{transactionId.toString().padStart(6, '0')}
                  </p>
                </div>
                <TransactionStatusBadge status={transaction.status} />
              </div>

              {/* Property Info */}
              <div className="mb-6 pb-6 border-b">
                {transaction.property?.picture &&
                  transaction.property.picture.length > 0 && (
                    <div className="w-full h-64 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-purple-100">
                      <img
                        src={transaction.property.picture[0]}
                        alt={transaction.property.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {transaction.property?.name}
                </h2>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {transaction.property?.address}, {transaction.property?.city}
                </div>
              </div>

              {/* Room Info */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <Bed className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {transaction.room?.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Maksimal {transaction.room?.maxGuests} tamu
                </p>
              </div>

              {/* Booking Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Check-in
                  </label>
                  <p className="font-semibold text-gray-900">
                    {formatDate(transaction.checkIn, 'long')}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    Check-out
                  </label>
                  <p className="font-semibold text-gray-900">
                    {formatDate(transaction.checkOut, 'long')}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Durasi:{' '}
                <span className="font-semibold">
                  {transaction.duration} malam
                </span>
              </p>
            </Card>

            {/* Payment Proof */}
            {latestPaymentProof && (
              <Card className="p-6 border-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Bukti Pembayaran
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <img
                    src={latestPaymentProof.image}
                    alt="Payment Proof"
                    className="w-full max-h-96 object-contain rounded-lg mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Diupload {getRelativeTime(latestPaymentProof.uploadedAt)}
                    </p>
                    {!latestPaymentProof.isValid &&
                      latestPaymentProof.rejectedReason && (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-semibold">Ditolak</span>
                        </div>
                      )}
                  </div>
                  {latestPaymentProof.rejectedReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <span className="font-semibold">Alasan:</span>{' '}
                        {latestPaymentProof.rejectedReason}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Status Info */}
            {transaction.status === 'PENDING_PAYMENT' && (
              <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-2">Menunggu Pembayaran</p>
                    <p>
                      Silakan lakukan pembayaran dan upload bukti transfer dalam
                      waktu 2 jam sejak booking dibuat.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {transaction.status === 'CONFIRMED' && (
              <Card className="p-6 border-2 border-green-200 bg-green-50">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold mb-2">Booking Dikonfirmasi!</p>
                    <p>
                      Booking Anda telah dikonfirmasi. Silakan check-in sesuai
                      tanggal yang telah ditentukan.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Review Form */}
            {canReview && !showReviewForm && (
              <Card className="p-6 border-2">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Bagaimana pengalaman Anda?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Berikan review untuk membantu calon tamu lainnya
                  </p>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                  >
                    Tulis Review
                  </Button>
                </div>
              </Card>
            )}

            {showReviewForm && (
              <ReviewForm
                onSubmit={handleSubmitReview}
                propertyName={transaction.property?.name || ''}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Summary */}
              <Card className="p-6 border-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ringkasan Harga
                </h3>
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span className="text-sm">
                      {transaction.duration} malam
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(transaction.totalPrice)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(transaction.totalPrice)}
                  </span>
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6 border-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi</h3>
                <div className="space-y-3">
                  {canUploadPayment && (
                    <Button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl h-11"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {latestPaymentProof?.rejectedReason
                        ? 'Upload Ulang Bukti Bayar'
                        : 'Upload Bukti Bayar'}
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      onClick={handleCancelTransaction}
                      disabled={isCancelling}
                      variant="outline"
                      className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-xl h-11"
                    >
                      ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Batalkan Booking
                      </>
                      ){'}'}
                    </Button>
                  )}
                </div>
              </Card>

              {/* Booking Info */}
              <Card className="p-6 border-2 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Informasi Booking
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Booking</span>
                    <span className="font-semibold text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-mono font-semibold text-gray-900">
                      #{transactionId.toString().padStart(6, '0')}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Upload Modal */}
      <PaymentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadPayment}
        transactionId={transactionId}
      />
    </div>
  );
}

export default withAuth(TransactionDetailPage, {
  requireAuth: true,
  requiredRole: 'user',
  requireVerified: true,
});
