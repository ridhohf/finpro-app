'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { TransactionStatusBadge } from '@/components/transaction/TransactionStatusBadge';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Calendar,
  Bed,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { transactionAPI } from '@/lib/api/transaction.api';
import { reviewAPI } from '@/lib/api/review.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { withAuth } from '@/lib/hoc/withAuth';
import { formatCurrency } from '@/lib/currency';
import { formatDate, getRelativeTime } from '@/lib/utils/date';
import { toast } from 'sonner';
import type { Transaction } from '@/types/transaction.types';
import type { Review } from '@/types/review.types';

function TenantOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const transactionId = parseInt(params.id as string);

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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

      // Load review if completed
      if (response.data?.status === 'COMPLETED' && response.data.propertyId) {
        try {
          const reviewResponse = await reviewAPI.getPropertyReviews(
            response.data.propertyId
          );
          const transactionReview = reviewResponse.data?.reviews.find(
            (r: any) => r.reservationId === transactionId
          );
          if (transactionReview) {
            setReview(transactionReview as any);
          }
        } catch (error) {
          console.log('No review found');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat detail pesanan');
      router.push('/tenant/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!token) return;

    if (!confirm('Apakah Anda yakin ingin mengkonfirmasi pembayaran ini?')) {
      return;
    }

    setIsConfirming(true);
    try {
      await transactionAPI.confirmPayment(transactionId, token);
      toast.success('Pembayaran berhasil dikonfirmasi!');
      await loadTransactionDetail();
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengkonfirmasi pembayaran');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!token) return;

    if (!rejectReason.trim()) {
      toast.error('Alasan penolakan wajib diisi');
      return;
    }

    setIsRejecting(true);
    try {
      await transactionAPI.rejectPayment(transactionId, rejectReason, token);
      toast.success('Pembayaran ditolak');
      setIsRejectDialogOpen(false);
      setRejectReason('');
      await loadTransactionDetail();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menolak pembayaran');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!token) return;

    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    setIsCancelling(true);
    try {
      await transactionAPI.cancelTransaction(
        transactionId,
        'Dibatalkan oleh tenant',
        token
      );
      toast.success('Pesanan berhasil dibatalkan');
      await loadTransactionDetail();
    } catch (error: any) {
      toast.error(error.message || 'Gagal membatalkan pesanan');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReplyReview = async (reply: string) => {
    if (!token || !review) return;

    await reviewAPI.replyToReview(review.id, { reply }, token);
    await loadTransactionDetail();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!transaction) {
    return null;
  }

  const canConfirmPayment = transaction.status === 'PENDING_CONFIRMATION';
  const canCancel = transaction.status === 'PENDING_PAYMENT';

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
          onClick={() => router.push('/tenant/orders')}
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
                    Detail Pesanan
                  </h1>
                  <p className="text-gray-600">
                    Order ID: #{transactionId.toString().padStart(6, '0')}
                  </p>
                </div>
                <TransactionStatusBadge status={transaction.status} />
              </div>

              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Informasi Tamu
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Nama</p>
                      <p className="font-semibold text-gray-900">
                        {transaction.user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">
                        {transaction.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="mb-6 pb-6 border-b">
                {transaction.property?.picture &&
                  transaction.property.picture.length > 0 && (
                    <div className="w-full h-64 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-100 to-pink-100">
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

              {/* Room & Dates */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center gap-2 mb-4">
                  <Bed className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {transaction.room?.name}
                  </h3>
                </div>

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
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Ringkasan Pembayaran
                </h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-700">Total Pembayaran</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatCurrency(transaction.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
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
                    className="w-full max-h-96 object-contain rounded-lg mb-3 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      window.open(latestPaymentProof.image, '_blank')
                    }
                  />
                  <p className="text-sm text-gray-600 text-center">
                    Klik gambar untuk memperbesar • Diupload{' '}
                    {getRelativeTime(latestPaymentProof.uploadedAt)}
                  </p>
                </div>
              </Card>
            )}

            {/* Review Section */}
            {review && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Review dari Tamu
                </h3>
                <ReviewCard
                  review={review}
                  canReply={!review.tenantReply}
                  onReply={handleReplyReview}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Action Buttons */}
              {canConfirmPayment && (
                <Card className="p-6 border-2 border-blue-200 bg-blue-50">
                  <div className="flex gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Perlu Konfirmasi</p>
                      <p>
                        Periksa bukti pembayaran dan konfirmasi atau tolak
                        pesanan ini.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={isConfirming}
                      className="w-full bg-green-600 hover:bg-green-700 rounded-xl h-11"
                    >
                      {isConfirming ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Mengkonfirmasi...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Konfirmasi Pembayaran
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => setIsRejectDialogOpen(true)}
                      variant="outline"
                      className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-xl h-11"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak Pembayaran
                    </Button>
                  </div>
                </Card>
              )}

              {canCancel && (
                <Card className="p-6 border-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi</h3>
                  <Button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    variant="outline"
                    className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-xl h-11"
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Membatalkan...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Batalkan Pesanan
                      </>
                    )}
                  </Button>
                </Card>
              )}

              {/* Order Info */}
              <Card className="p-6 border-2 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Informasi Pesanan
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Booking</span>
                    <span className="font-semibold text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-mono font-semibold text-gray-900">
                      #{transactionId.toString().padStart(6, '0')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <TransactionStatusBadge
                      status={transaction.status}
                      className="text-xs"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">
              Tolak Pembayaran
            </DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan untuk customer. Mereka dapat mengupload
              ulang bukti pembayaran setelah ditolak.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Nominal transfer tidak sesuai, bukti transfer tidak jelas, dll..."
              className="min-h-32 rounded-xl border-2"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectReason('');
              }}
              disabled={isRejecting}
              className="flex-1 rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleRejectPayment}
              disabled={isRejecting || !rejectReason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menolak...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak Pembayaran
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(TenantOrderDetailPage, {
  requireAuth: true,
  requiredRole: 'tenant',
  requireVerified: true,
});
