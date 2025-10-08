"use client";

import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bed,
  Building2,
  Edit,
  Eye,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { tenantAPI } from "@/lib/api/tenant.api";
import { useAuthStore } from "@/lib/store/auth.store";

export default function TenantPropertiesPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    loadProperties();
    loadCategories();
  }, [filters, pagination.page]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = parseInt(filters.categoryId);

      const response = await tenantAPI.getProperties(params, token!);

      if (response.data) {
        setProperties(response.data);
      }

      if (response.pagination) {
        setPagination({
          ...pagination,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await tenantAPI.getCategories(token!);
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleDelete = async (propertyId: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await tenantAPI.deleteProperty(propertyId, token!);
      toast.success("Property deleted successfully");
      loadProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete property");
    }
  };

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Properties
                </h1>
                <p className="text-gray-600">Manage your property listings</p>
              </div>
              <Button
                onClick={() => router.push("/tenant/properties/new")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <Select
                  value={filters.categoryId || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      categoryId: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split("-");
                    setFilters({ ...filters, sortBy, sortOrder });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && properties.length === 0 && (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Properties Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first property listing
              </p>
              <Button
                onClick={() => router.push("/tenant/properties/new")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            </Card>
          )}

          {/* Properties Grid */}
          {!isLoading && properties.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="flex">
                      {/* Image */}
                      <div className="w-48 h-48 flex-shrink-0 bg-gray-200 relative">
                        {property.picture?.[0] ? (
                          <img
                            src={property.picture[0]}
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-900">
                          {property.category?.name || "Uncategorized"}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                            {property.name}
                          </h3>

                          <div className="flex items-center text-gray-600 text-sm mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="line-clamp-1">
                              {property.address}, {property.city}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {property.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              {property._count?.rooms || 0} rooms
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {property._count?.reviews || 0} reviews
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              router.push(
                                `/tenant/properties/${property.id}/rooms`
                              )
                            }
                          >
                            <Bed className="w-4 h-4 mr-1" />
                            Rooms
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              router.push(
                                `/tenant/properties/${property.id}/edit`
                              )
                            }
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page - 1,
                      })
                    }
                  >
                    Previous
                  </Button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <span key={`ellipsis-${page}`} className="px-2">
                            ...
                          </span>
                        );
                      }

                      return (
                        <Button
                          key={page}
                          variant={
                            pagination.page === page ? "default" : "outline"
                          }
                          onClick={() => setPagination({ ...pagination, page })}
                        >
                          {page}
                        </Button>
                      );
                    })}

                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page + 1,
                      })
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Info Card */}
          <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Property Management Tips
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Add high-quality photos to attract more guests</li>
                  <li>
                    • Keep room availability updated for accurate bookings
                  </li>
                  <li>
                    • Set peak season rates for holidays and special events
                  </li>
                  <li>• Respond to reviews to build trust with guests</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
