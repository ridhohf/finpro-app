"use client";

import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tenantAPI } from "@/lib/api/tenant.api";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  Building2,
  Bed,
  Tag,
  Star,
  TrendingUp,
  Plus,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function TenantDashboardPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await tenantAPI.getDashboard(token!);
      if (response.data) {
        setDashboard(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = dashboard?.statistics || {};
  const chartData = dashboard?.charts?.propertiesPerCategory || [];
  const recentProperties = dashboard?.recentProperties || [];

  const COLORS = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
  ];

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.tenantProfile?.companyName || "Your Dashboard"}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          )}

          {!isLoading && dashboard && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Properties */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Total Properties
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalProperties || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/tenant/properties")}
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      View Properties
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>

                {/* Total Rooms */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalRooms || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Bed className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      Across all properties
                    </p>
                  </div>
                </Card>

                {/* Total Categories */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Categories</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalCategories || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Tag className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/tenant/categories")}
                      className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      Manage Categories
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>

                {/* Average Rating */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.averageRating || 0}
                        <span className="text-lg text-gray-500">/5.0</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      {stats.totalReviews || 0} reviews
                    </p>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Properties by Category Chart */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Properties by Category
                  </h3>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="categoryName"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No data available</p>
                        <p className="text-sm">
                          Create properties to see chart
                        </p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push("/tenant/properties/new")}
                      className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
                      size="lg"
                    >
                      <Plus className="w-5 h-5 mr-3" />
                      Add New Property
                    </Button>
                    <Button
                      onClick={() => router.push("/tenant/categories")}
                      variant="outline"
                      className="w-full justify-start"
                      size="lg"
                    >
                      <Tag className="w-5 h-5 mr-3" />
                      Manage Categories
                    </Button>
                    <Button
                      onClick={() => router.push("/tenant/properties")}
                      variant="outline"
                      className="w-full justify-start"
                      size="lg"
                    >
                      <Building2 className="w-5 h-5 mr-3" />
                      View All Properties
                    </Button>
                  </div>

                  {/* Tips Card */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                      Pro Tips
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Upload high-quality photos</li>
                      <li>• Set competitive prices</li>
                      <li>• Keep availability updated</li>
                      <li>• Respond to reviews quickly</li>
                    </ul>
                  </div>
                </Card>
              </div>

              {/* Recent Properties */}
              {recentProperties.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Properties
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/tenant/properties")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {recentProperties.map((property: any) => (
                      <div
                        key={property.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          router.push(`/tenant/properties/${property.id}/rooms`)
                        }
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                            {property.picture?.[0] ? (
                              <img
                                src={property.picture[0]}
                                alt={property.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {property.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {property.category?.name || "Uncategorized"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {property._count?.rooms || 0} rooms
                            </p>
                            <p className="text-sm text-gray-600">
                              ⭐ {property._count?.reviews || 0} reviews
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}