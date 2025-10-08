"use client";

import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tenantAPI } from "@/lib/api/tenant.api";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Loader2,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

export default function PeakSeasonsPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const propertyId = parseInt(params.id as string);
  const roomId = parseInt(params.roomId as string);

  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const [peakSeasons, setPeakSeasons] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    priceIncreaseType: "percentage",
    value: "",
  });

  useEffect(() => {
    loadRoomData();
    loadPeakSeasons();
  }, []);

  const loadRoomData = async () => {
    try {
      const response = await tenantAPI.getRoomById(roomId, token!);
      if (response.data) {
        setRoom(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load room data");
      router.push(`/tenant/properties/${propertyId}/rooms`);
    }
  };

  const loadPeakSeasons = async () => {
    setIsLoading(true);
    try {
      const response = await tenantAPI.getPeakSeasons(roomId, token!);
      if (response.data) {
        setPeakSeasons(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load peak seasons");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (season?: any) => {
    if (season) {
      setSelectedSeason(season);
      setFormData({
        name: season.name,
        startDate: season.startDate.split("T")[0],
        endDate: season.endDate.split("T")[0],
        priceIncreaseType: season.priceIncreaseType,
        value: season.value.toString(),
      });
    } else {
      setSelectedSeason(null);
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        priceIncreaseType: "percentage",
        value: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSeason(null);
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      priceIncreaseType: "percentage",
      value: "",
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Season name is required");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Start and end dates are required");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      toast.error("Price increase value must be greater than 0");
      return;
    }

    if (
      formData.priceIncreaseType === "percentage" &&
      parseFloat(formData.value) > 100
    ) {
      toast.error("Percentage cannot exceed 100%");
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        roomId,
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        priceIncreaseType: formData.priceIncreaseType as
          | "percentage"
          | "nominal",
        value: parseFloat(formData.value),
      };

      if (selectedSeason) {
        await tenantAPI.updatePeakSeason(selectedSeason.id, data, token!);
        toast.success("Peak season updated successfully");
      } else {
        await tenantAPI.createPeakSeason(data, token!);
        toast.success("Peak season created successfully");
      }

      handleCloseDialog();
      loadPeakSeasons();
    } catch (error: any) {
      toast.error(error.message || "Failed to save peak season");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (season: any) => {
    if (!confirm(`Are you sure you want to delete "${season.name}"?`)) return;

    try {
      await tenantAPI.deletePeakSeason(season.id, token!);
      toast.success("Peak season deleted successfully");
      loadPeakSeasons();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete peak season");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculatePrice = (season: any) => {
    if (!room) return 0;
    const basePrice = Number(room.basePrice);
    if (season.priceIncreaseType === "percentage") {
      return basePrice + (basePrice * Number(season.value)) / 100;
    }
    return basePrice + Number(season.value);
  };

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() =>
                router.push(`/tenant/properties/${propertyId}/rooms`)
              }
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Peak Seasons
                </h1>
                <p className="text-gray-600">{room?.name || "Loading..."}</p>
              </div>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Peak Season
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Base Price Info */}
          {room && (
            <Card className="p-6 mb-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Base Price (Before Peak Season Adjustment)
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(Number(room.basePrice))}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Per night for {room.name}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-orange-700" />
                </div>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading peak seasons...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && peakSeasons.length === 0 && (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-4">
                <Calendar className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Peak Seasons Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create peak seasons to automatically increase prices during
                holidays and special events
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Peak Season
              </Button>
            </Card>
          )}

          {/* Peak Seasons List */}
          {!isLoading && peakSeasons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {peakSeasons.map((season) => (
                <Card
                  key={season.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {season.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(season.startDate)} -{" "}
                          {formatDate(season.endDate)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={
                        season.priceIncreaseType === "percentage"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {season.priceIncreaseType === "percentage"
                        ? `+${season.value}%`
                        : `+${formatCurrency(Number(season.value))}`}
                    </Badge>
                  </div>

                  {/* Price Calculation */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Base Price</span>
                      <span className="text-sm font-medium">
                        {room && formatCurrency(Number(room.basePrice))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Increase</span>
                      <span className="text-sm font-medium text-orange-600">
                        {season.priceIncreaseType === "percentage"
                          ? `+${season.value}%`
                          : `+${formatCurrency(Number(season.value))}`}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          Peak Price
                        </span>
                        <span className="text-lg font-bold text-orange-600">
                          {formatCurrency(calculatePrice(season))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(season)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(season)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Info Card */}
          <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              💡 Peak Season Tips
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                • Use <strong>percentage</strong> for proportional increases
                (e.g., 50% increase)
              </li>
              <li>
                • Use <strong>nominal</strong> for fixed amount increases (e.g.,
                +Rp 100,000)
              </li>
              <li>
                • Peak seasons automatically apply to all bookings within the
                date range
              </li>
              <li>
                • Multiple peak seasons can overlap - the highest price will
                apply
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSeason ? "Edit Peak Season" : "Create Peak Season"}
            </DialogTitle>
            <DialogDescription>
              Set price increases for holidays and special events
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Season Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Christmas Holiday, Eid Mubarak"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                maxLength={255}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price Increase Type *</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={formData.priceIncreaseType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priceIncreaseType: e.target.value,
                  })
                }
              >
                <option value="percentage">Percentage (%)</option>
                <option value="nominal">Nominal (IDR)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                {formData.priceIncreaseType === "percentage"
                  ? "Percentage Increase *"
                  : "Nominal Increase (IDR) *"}
              </Label>
              <Input
                id="value"
                type="number"
                placeholder={
                  formData.priceIncreaseType === "percentage"
                    ? "e.g., 50"
                    : "e.g., 100000"
                }
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                min="1"
                step={
                  formData.priceIncreaseType === "percentage" ? "1" : "1000"
                }
              />
              <p className="text-xs text-gray-500">
                {formData.priceIncreaseType === "percentage"
                  ? "Value between 1-100"
                  : "Amount will be added to base price"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : selectedSeason ? (
                "Update Season"
              ) : (
                "Create Season"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
