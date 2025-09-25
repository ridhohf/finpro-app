"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/lib/api";
import { User, Building2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["user", "tenant"]).refine((val) => !!val, {
      message: "Please select a role",
    }),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate tenant-specific fields if role is tenant
    if (data.role === "tenant") {
      if (!data.companyName || data.companyName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Company name is required for property owners and must be at least 2 characters",
          path: ["companyName"],
        });
      }

      if (data.companyName && data.companyName.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company name must not exceed 100 characters",
          path: ["companyName"],
        });
      }

      // Validate phone only if provided for tenant
      if (data.phone && data.phone.trim() !== "" && data.phone.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please provide a valid phone number",
          path: ["phone"],
        });
      }
    }

    // Validate address length for both roles if provided
    if (data.address && data.address.length > 500) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address must not exceed 500 characters",
        path: ["address"],
      });
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: (email?: string) => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
      companyName: "",
      phone: "",
      address: "",
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await authApi.register(data);

      toast.success("Registration successful!", {
        description: response.data.message,
      });

      onSuccess?.(data.email);
    } catch (error: any) {
      toast.error("Registration failed", {
        description:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto glass-effect">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Create your account
        </CardTitle>
        <p className="text-gray-600">
          Join thousands of travelers and property owners
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="pl-10"
                {...form.register("name")}
              />
            </div>
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              I want to
            </Label>
            <Select
              onValueChange={(value: "user" | "tenant") =>
                form.setValue("role", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Book stays</div>
                      <div className="text-sm text-gray-500">
                        Find and book amazing accommodations
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="tenant">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">List my property</div>
                      <div className="text-sm text-gray-500">
                        Rent out my space and earn money
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-600">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          {/* Tenant-specific fields */}
          {selectedRole === "tenant" && (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="text-sm font-medium text-gray-700"
                >
                  Company Name *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your company or business name"
                    className="pl-10"
                    {...form.register("companyName")}
                  />
                </div>
                {form.formState.errors.companyName && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+62"
                    className="pl-10"
                    {...form.register("phone")}
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Business Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <textarea
                    id="address"
                    placeholder="Your business address"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...form.register("address")}
                  />
                </div>
                {form.formState.errors.address && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full agoda-button"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
