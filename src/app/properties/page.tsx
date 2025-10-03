"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PropertyFilters } from "@/components/properties/propertyFilters";
import { PropertyCard } from "@/components/properties/propertyCard";
import { PropertySort } from "@/components/properties/propertySort";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { propertyAPI } from "@/lib/api/property.api";
import type { Property } from "@/types/property.types";
import { toast } from "sonner";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "",
    categoryId: searchParams.get("categoryId") || "",
    search: searchParams.get("search") || "",
    minPrice: "",
    maxPrice: "",
  });

  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadProperties();
  }, [pagination.page, sortBy, sortOrder]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const response = await propertyAPI.searchProperties({
        city: filters.city || undefined,
        checkIn: filters.checkIn || undefined,
        checkOut: filters.checkOut || undefined,
        guests: filters.guests ? parseInt(filters.guests) : undefined,
        categoryId: filters.categoryId
          ? parseInt(filters.categoryId)
          : undefined,
        search: filters.search || undefined,
        sortBy,
        sortOrder,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (response.data) {
        setProperties(response.data);
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

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 }); // Reset to page 1
  };

  const handleSearch = () => {
    loadProperties();
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {filters.city
                ? `Properties in ${filters.city}`
                : "All Properties"}
            </h1>
            <p className="text-gray-600">
              {isLoading
                ? "Loading..."
                : `${pagination.total} properties found`}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <PropertyFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
              />
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Sort Controls */}
              <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">
                  Showing {properties.length} of {pagination.total} properties
                </div>
                <PropertySort
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={(newSortBy, newSortOrder) => {
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                />
              </div>

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
                <div className="text-center py-20 bg-white rounded-lg">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button
                    onClick={() => {
                      setFilters({
                        city: "",
                        checkIn: "",
                        checkOut: "",
                        guests: "",
                        categoryId: "",
                        search: "",
                        minPrice: "",
                        maxPrice: "",
                      });
                      handleSearch();
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Properties Grid */}
              {!isLoading && properties.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        Previous
                      </Button>

                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      )
                        .filter((page) => {
                          // Show first, last, current, and adjacent pages
                          return (
                            page === 1 ||
                            page === pagination.totalPages ||
                            Math.abs(page - pagination.page) <= 1
                          );
                        })
                        .map((page, index, array) => {
                          // Add ellipsis
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
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}

                      <Button
                        variant="outline"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
