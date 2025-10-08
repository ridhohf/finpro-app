"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuthStore } from "@/lib/store/auth.store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  User,
  Mail,
  Building2,
  Phone,
  MapPin,
  Lock,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { authAPI } from "@/lib/api/auth.api";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.tenantProfile?.phone || "",
    address: user?.tenantProfile?.address || "",
    companyName: user?.tenantProfile?.companyName || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (1MB)
      if (file.size > 1024 * 1024) {
        toast.error("Image size must be less than 1MB");
        return;
      }

      // Validate file type
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          file.type
        )
      ) {
        toast.error("Only JPG, PNG, and GIF images are allowed");
        return;
      }

      setSelectedAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const response = await authAPI.updateProfile(
        token!,
        {
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone || undefined,
          address: profileForm.address || undefined,
          companyName: profileForm.companyName || undefined,
        },
        selectedAvatar || undefined
      );

      if (response.success) {
        toast.success(response.message);

        // Update local user state
        updateUser({
          name: profileForm.name,
          email: profileForm.email,
        });

        // If email changed, show verification warning
        if (response.data?.emailChanged) {
          toast.warning("Please verify your new email address", {
            duration: 5000,
          });
        }

        // Clear avatar selection
        setSelectedAvatar(null);
        setAvatarPreview(null);

        // Refresh user data
        const profileResponse = await authAPI.getProfile(token!);
        if (profileResponse.data) {
          updateUser(profileResponse.data);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await authAPI.updatePassword(token!, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.success) {
        toast.success(response.message);
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResendingVerification(true);
    try {
      await authAPI.resendVerification(user.email);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification email");
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account information and preferences
              </p>
            </div>

            {/* Email Verification Warning */}
            {!user?.isVerified && (
              <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Email Not Verified
                    </h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      Please verify your email address to access all features.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                      className="bg-white"
                    >
                      {isResendingVerification ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend Verification Email"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Avatar Card */}
              <div className="lg:col-span-1">
                <Card className="p-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-32 h-32">
                        {avatarPreview || user?.avatar ? (
                          <img
                            src={avatarPreview || user?.avatar}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                            {getInitials(user?.name || "U")}
                          </div>
                        )}
                      </Avatar>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900">
                      {user?.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{user?.email}</p>

                    <div className="mt-3 flex items-center justify-center gap-2">
                      <Badge
                        variant={user?.isVerified ? "default" : "secondary"}
                        className={
                          user?.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {user?.isVerified ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {user?.isVerified ? "Verified" : "Not Verified"}
                      </Badge>
                      <Badge className="capitalize">{user?.role}</Badge>
                    </div>

                    {selectedAvatar && (
                      <p className="text-xs text-gray-500 mt-3">
                        New photo will be saved when you update profile
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      Max size: 1MB | JPG, PNG, GIF
                    </p>
                  </div>
                </Card>

                {user?.role === "tenant" && user.tenantProfile && (
                  <Card className="p-6 mt-6 bg-purple-50 border-purple-200">
                    <div className="text-center">
                      <Building2 className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Business Account
                      </h3>
                      <p className="text-sm text-gray-700">
                        {user.tenantProfile.companyName}
                      </p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Profile Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h2>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            placeholder="John Doe"
                            className="pl-10"
                            value={profileForm.name}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            value={profileForm.email}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {user?.role === "tenant" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="companyName"
                              placeholder="Your Company"
                              className="pl-10"
                              value={profileForm.companyName}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  companyName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+62"
                              className="pl-10"
                              value={profileForm.phone}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Business Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Textarea
                              id="address"
                              placeholder="123 Business Street, City"
                              className="pl-10 resize-none"
                              rows={3}
                              value={profileForm.address}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Separator className="my-4" />

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSavingProfile}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSavingProfile ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Change Password */}
                {!user?.provider && (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Change Password
                    </h2>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Current Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="oldPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={passwordForm.oldPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                oldPassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password *
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSavingPassword}
                          variant="outline"
                        >
                          {isSavingPassword ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                {user?.provider && (
                  <Card className="p-6 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Social Login Account
                        </h3>
                        <p className="text-sm text-gray-600">
                          You signed in with {user.provider}. Password
                          management is not available for social accounts.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
