import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { TransactionStatusBadge } from './TransactionStatusBadge';
import type { Transaction } from '@/types/transaction.types';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/utils/date';
import {
  Calendar,
  MapPin,
  Bed,
  ArrowRight,
  User,
  Building2,
} from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  viewType: 'user' | 'tenant';
}

export function TransactionCard({
  transaction,
  viewType,
}: TransactionCardProps) {
  const linkUrl =
    viewType === 'user'
      ? `/user/transactions/${transaction.id}`
      : `/tenant/orders/${transaction.id}`;

  return (
    <Link href={linkUrl}>
      <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer bg-white">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Property Image */}
          {transaction.property?.picture &&
            transaction.property.picture.length > 0 && (
              <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  src={transaction.property.picture[0]}
                  alt={transaction.property.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

          {/* Transaction Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {transaction.property?.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {transaction.property?.city}
                  </div>
                </div>
                <TransactionStatusBadge status={transaction.status} />
              </div>

              {/* Room & Guest Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {transaction.room?.name}
                  </span>
                </div>
                {viewType === 'tenant' && transaction.user && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{transaction.user.name}</span>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>{formatDate(transaction.checkIn)}</span>
                </div>
                <ArrowRight className="w-4 h-4" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>{formatDate(transaction.checkOut)}</span>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                  {transaction.duration} malam
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Harga</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(transaction.totalPrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Booking ID</p>
                <p className="text-sm font-mono font-semibold text-gray-700">
                  #{transaction.id.toString().padStart(6, '0')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
