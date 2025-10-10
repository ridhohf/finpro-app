import { useMemo } from "react";

export function useBookingCalculations(
  room: any,
  checkIn: string,
  checkOut: string
) {
  const duration = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!room) return 0;
    const pricePerNight = room.currentPrice || room.basePrice;
    return pricePerNight * duration;
  }, [room, duration]);

  return { duration, totalPrice };
}