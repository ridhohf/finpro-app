'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Loader2,
  Calendar,
  Bed,
  MapPin,
  ArrowLeft,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { propertyAPI } from '@/lib/api/property.api';
import { transactionAPI } from '@/lib/api/transaction.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { formatCurrency } from '@/lib/currency';
import { formatDate, calculateDuration } from '@/lib/utils/date';
import { toast } from 'sonner';
import type { PropertyDetail } from '@/types/property.types';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, isAuthenticated } = useAuthStore();

  const propertyId = parseInt(params.id as string);
  const roomId = parseInt(searchParams.get('roomId') || '0');
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push(`/login/user?redirect=/properties/${propertyId}/book`);
      return;
    }

    if (!user?.isVerified) {
      toast.error('Email Anda belum terverifikasi');
      router.push('/verify-email-required');
      return;
    }

    if (!roomId || !checkIn || !checkOut) {
      toast.error('Data booking tidak lengkap');
      router.push(`/properties/${propertyId}`);
      return;
    }

    loadPropertyDetail();
  }, []);

  const loadPropertyDetail = async () => {
    setIsLoading(true);
    try {
      const response = await propertyAPI.getPropertyDetail(
        propertyId,
        checkIn,
        checkOut
      );
      if (response.data) {
        setProperty(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat detail properti');
      router.push(`/properties/${propertyId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!token) {
      toast.error('Token tidak ditemukan');
      return;
    }

    setIsBooking(true);
    try {
      const response = await transactionAPI.createBooking(
        {
          roomId,
          checkIn,
          checkOut,
        },
        token
      );

      toast.success('Booking berhasil dibuat!');
      router.push(`/user/transactions/${response.data?.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat booking');
    } finally {
      setIsBooking(false);
    }
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

  if (!property) {
    return null;
  }

  const selectedRoom = property.rooms.find((r) => r.id === roomId);
  const duration = calculateDuration(checkIn, checkOut);
  const totalPrice = selectedRoom
    ? (selectedRoom.currentPrice || selectedRoom.basePrice) * duration
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-white rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Konfirmasi Booking
              </h1>

              {/* Property Info */}
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {property.name}
                </h2>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {property.address}, {property.city}
                </div>
              </div>

              {/* Room Info */}
              {selectedRoom && (
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2 mb-3">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedRoom.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {selectedRoom.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      Maksimal {selectedRoom.maxGuests} tamu
                    </span>
                    <span className="text-blue-600 font-semibold">
                      {formatCurrency(
                        selectedRoom.currentPrice || selectedRoom.basePrice
                      )}
                      /malam
                    </span>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Detail Tanggal
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      Check-in
                    </label>
                    <p className="font-semibold text-gray-900">
                      {formatDate(checkIn, 'long')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      Check-out
                    </label>
                    <p className="font-semibold text-gray-900">
                      {formatDate(checkOut, 'long')}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Durasi:{' '}
                  <span className="font-semibold">{duration} malam</span>
                </p>
              </div>

              {/* Guest Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Informasi Tamu
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Nama</p>
                  <p className="font-semibold text-gray-900 mb-3">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
              </div>
            </Card>

            {/* Payment Info */}
            <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-2">Informasi Pembayaran</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Setelah booking, Anda memiliki waktu 2 jam untuk melakukan
                      pembayaran
                    </li>
                    <li>Upload bukti pembayaran setelah transfer</li>
                    <li>
                      Booking akan otomatis dibatalkan jika tidak ada pembayaran
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Price Summary - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6 border-2">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Ringkasan Harga
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      {formatCurrency(
                        selectedRoom?.currentPrice ||
                          selectedRoom?.basePrice ||
                          0
                      )}{' '}
                      x {duration} malam
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-200 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Konfirmasi Booking
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang
                  berlaku
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
