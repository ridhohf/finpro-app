"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { profileApi, User } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User as UserIcon,
  Mail,
  Building2,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import EditProfileDialog from "@/components/profile/edit-profile-dialog";
import ChangePasswordDialog from "@/components/profile/change-password-dialog";
import UpdateEmailDialog from "@/components/profile/update-email-dialog";
import AvatarUploadDialog from "@/components/profile/avatar-upload-dialog";

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [isAuthenticated, router]);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      const userData = response.data.data;
      if (userData) {
        setProfile(userData);
        // Update auth store with latest data
        updateUser(userData);
      }
    } catch (error: any) {
      toast.error("Failed to load profile", {
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    fetchProfile(); // Refresh profile data
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <p className="text-center text-gray-600">
            Failed to load profile data
          </p>
          <Button onClick={fetchProfile} className="mt-4 w-full">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Verification Alert */}
        {!profile.isVerified && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-orange-800">
                    Email verification required
                  </h3>
                  <p className="mt-1 text-sm text-orange-700">
                    Your email address is not verified. Some features may be
                    limited.
                  </p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      Resend verification email
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <AvatarUploadDialog
                      currentAvatar={profile.avatar}
                      onAvatarUpdate={handleProfileUpdate}
                    >
                      <Button
                        size="sm"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </AvatarUploadDialog>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {profile.name}
                    </h2>
                    <p className="text-gray-600">{profile.email}</p>
                    <div className="flex items-center justify-center mt-2 space-x-2">
                      <Badge
                        variant={
                          profile.role === "tenant" ? "default" : "secondary"
                        }
                      >
                        {profile.role === "tenant"
                          ? "Property Owner"
                          : "Traveler"}
                      </Badge>
                      {profile.isVerified && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {formatDate(profile.createdAt || new Date())}
                    </span>
                  </div>

                  {profile.tenantProfile && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {profile.tenantProfile.companyName}
                          </span>
                        </div>

                        {profile.tenantProfile.phone && (
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{profile.tenantProfile.phone}</span>
                          </div>
                        )}

                        {profile.tenantProfile.address && (
                          <div className="flex items-start space-x-3 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span>{profile.tenantProfile.address}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <EditProfileDialog
                  profile={profile}
                  onProfileUpdate={handleProfileUpdate}
                >
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </EditProfileDialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.role === "tenant"
                        ? "Property Owner"
                        : "Traveler"}
                    </p>
                  </div>

                  {profile.tenantProfile && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.tenantProfile.companyName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.tenantProfile.phone || "Not provided"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                          Business Address
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile.tenantProfile.address || "Not provided"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Account Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Address</h3>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                    {!profile.isVerified && (
                      <Badge variant="destructive" className="mt-1">
                        Not Verified
                      </Badge>
                    )}
                  </div>
                  <UpdateEmailDialog
                    currentEmail={profile.email}
                    onEmailUpdate={handleProfileUpdate}
                  >
                    <Button variant="outline" size="sm">
                      Change Email
                    </Button>
                  </UpdateEmailDialog>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">
                      Last updated recently
                    </p>
                  </div>
                  <ChangePasswordDialog onPasswordChange={handleProfileUpdate}>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </ChangePasswordDialog>
                </div>
              </CardContent>
            </Card>

            {/* Account Statistics (for tenants) */}
            {profile.role === "tenant" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">
                        Active Properties
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600">
                        Total Bookings
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        0
                      </div>
                      <div className="text-sm text-gray-600">
                        Pending Reviews
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
