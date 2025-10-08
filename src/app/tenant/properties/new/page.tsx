"use client";

import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { propertyAPI } from "@/lib/api/property.api";
import { tenantAPI } from "@/lib/api/tenant.api";
import { useAuthStore } from "@/lib/store/auth.store";
import {
    ArrowLeft,
    Loader2,
    MapPin,
    Upload,
    X
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PropertyFormPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();

  const isEditMode = !!params?.id;
  const propertyId = params?.id ? parseInt(params.id as string) : null;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    loadCategories();
    loadCities();
    if (isEditMode && propertyId) {
      loadPropertyData();
    }
  }, []);

  const loadCategories = async () => {
    try {
      const response = await tenantAPI.getCategories(token!);
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load categories");
    }
  };

  const loadCities = async () => {
    try {
      const response = await propertyAPI.getCities();
      if (response.data) {
        setCities(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load cities");
    }
  };

  const loadPropertyData = async () => {
    setIsLoading(true);
    try {
      const response = await tenantAPI.getPropertyById(propertyId!, token!);
      if (response.data) {
        const property = response.data;
        setFormData({
          categoryId: property.categoryId.toString(),
          name: property.name,
          description: property.description,
          address: property.address,
          city: property.city,
        });
        setExistingImages(property.picture || []);
      }
    } catch (error: any) {
      toast.error("Failed to load property data");
      router.push("/tenant/properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate total images (existing + new) shouldn't exceed 10
    if (existingImages.length + selectedImages.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Validate each file
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

      // Create previews
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (
      isEditMode &&
      existingImages.length === 0 &&
      selectedImages.length === 0
    ) {
      toast.error("Please add at least one image");
      return;
    }

    if (!isEditMode && selectedImages.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        categoryId: parseInt(formData.categoryId),
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
      };

      if (isEditMode && propertyId) {
        await tenantAPI.updateProperty(
          propertyId,
          data,
          selectedImages,
          token!
        );
        toast.success("Property updated successfully");
      } else {
        await tenantAPI.createProperty(data, selectedImages, token!);
        toast.success("Property created successfully");
      }

      router.push("/tenant/properties");
    } catch (error: any) {
      toast.error(error.message || "Failed to save property");
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
            <p className="text-gray-600">Loading property data...</p>
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
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Property" : "Add New Property"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Update your property information"
              : "Fill in the details to list your property"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <p className="text-xs text-red-600">
                    No categories available.{" "}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => router.push("/tenant/categories")}
                    >
                      Create one first
                    </Button>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Property Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Luxury Ocean View Villa"
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
                  placeholder="Describe your property in detail..."
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
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Location
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                {cities.length > 0 ? (
                  <Select
                    value={formData.city}
                    onValueChange={(value) =>
                      setFormData({ ...formData, city: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="city"
                    placeholder="e.g., Jakarta"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    placeholder="Street address, district, etc."
                    className="pl-10 resize-none"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Property Images *
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Upload up to 10 images. First image will be the cover photo.
            </p>

            {/* Existing Images (Edit Mode) */}
            {isEditMode && existingImages.length > 0 && (
              <div className="mb-6">
                <Label className="mb-2 block">Current Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
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
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
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
              disabled={isSaving || categories.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Property"
              ) : (
                "Create Property"
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
