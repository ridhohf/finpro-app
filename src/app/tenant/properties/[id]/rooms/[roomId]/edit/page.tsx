"use client";

import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tenantAPI } from "@/lib/api/tenant.api";
import { useAuthStore } from "@/lib/store/auth.store";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const propertyId = parseInt(params.id as string);
  const roomId = parseInt(params.roomId as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    maxGuests: "",
  });

  useEffect(() => {
    loadPropertyData();
    loadRoomData();
  }, []);

  const loadPropertyData = async () => {
    try {
      const response = await tenantAPI.getPropertyById(propertyId, token!);
      if (response.data) {
        setProperty(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load property data");
    }
  };

  const loadRoomData = async () => {
    setIsLoading(true);
    try {
      const response = await tenantAPI.getRoomById(roomId, token!);
      if (response.data) {
        const room = response.data;
        setFormData({
          name: room.name,
          description: room.description,
          basePrice: room.basePrice.toString(),
          maxGuests: room.maxGuests.toString(),
        });
        setExistingImages(room.picture || []);
      }
    } catch (error: any) {
      toast.error("Failed to load room data");
      router.push(`/tenant/properties/${propertyId}/rooms`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (existingImages.length + selectedImages.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > 1024 * 1024) {
        toast.error(`${file.name} is too large (max 1MB)`);
        continue;
      }
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          file.type
        )
      ) {
        toast.error(`${file.name} is not a valid image type`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedImages([...selectedImages, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (existingImages.length === 0 && selectedImages.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    if (parseFloat(formData.basePrice) <= 0) {
      toast.error("Base price must be greater than 0");
      return;
    }

    if (parseInt(formData.maxGuests) <= 0) {
      toast.error("Max guests must be greater than 0");
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        maxGuests: parseInt(formData.maxGuests),
      };

      await tenantAPI.updateRoom(roomId, data, selectedImages, token!);
      toast.success("Room updated successfully");
      router.push(`/tenant/properties/${propertyId}/rooms`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update room");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="tenant">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading room data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
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

          <h1 className="text-3xl font-bold text-gray-900">Edit Room</h1>
          <p className="text-gray-600 mt-1">
            {property?.name || "Loading property..."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Room Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name / Type *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Deluxe Ocean View, Standard Double"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the room features, amenities, and highlights..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  minLength={20}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Minimum 20 characters ({formData.description.length}/20)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (IDR) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: e.target.value })
                    }
                    required
                    min="1"
                    step="1000"
                  />
                  <p className="text-xs text-gray-500">
                    Price per night before peak season adjustments
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxGuests">Maximum Guests *</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.maxGuests}
                    onChange={(e) =>
                      setFormData({ ...formData, maxGuests: e.target.value })
                    }
                    required
                    min="1"
                    max="20"
                  />
                  <p className="text-xs text-gray-500">
                    Maximum number of guests allowed
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Room Images *
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Upload up to 10 images. First image will be the cover photo.
            </p>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <Label className="mb-2 block">Current Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image}
                        alt={`Room ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {imagePreviews.length > 0 && (
              <div className="mb-6">
                <Label className="mb-2 block">New Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {existingImages.length + selectedImages.length < 10 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  id="images"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF (max 1MB each)
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {existingImages.length + selectedImages.length} of 10 images
                    uploaded
                  </p>
                </label>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Room"
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
