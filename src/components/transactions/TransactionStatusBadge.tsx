import { Badge } from '@/components/ui/badge';
import type { TransactionStatus } from '@/types/transaction.types';
import {
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Package,
} from 'lucide-react';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

export function TransactionStatusBadge({
  status,
  className = '',
}: TransactionStatusBadgeProps) {
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return {
          label: 'Menunggu Pembayaran',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
        };
      case 'PENDING_CONFIRMATION':
        return {
          label: 'Menunggu Konfirmasi',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: AlertCircle,
        };
      case 'CONFIRMED':
        return {
          label: 'Dikonfirmasi',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
        };
      case 'CANCELLED':
        return {
          label: 'Dibatalkan',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
        };
      case 'COMPLETED':
        return {
          label: 'Selesai',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Package,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.color} border px-3 py-1 font-semibold ${className}`}
    >
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {config.label}
    </Badge>
  );
}
