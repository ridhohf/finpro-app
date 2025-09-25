"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileApi } from "@/lib/api";
import { Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const updateEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
});

type UpdateEmailFormData = z.infer<typeof updateEmailSchema>;

interface UpdateEmailDialogProps {
  currentEmail: string;
  onEmailUpdate: () => void;
  children: React.ReactNode;
}

export default function UpdateEmailDialog({
  currentEmail,
  onEmailUpdate,
  children,
}: UpdateEmailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateEmailFormData>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const onSubmit = async (data: UpdateEmailFormData) => {
    if (data.newEmail === currentEmail) {
      toast.error("New email must be different from current email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await profileApi.updateEmail(data);

      toast.success("Email update initiated", {
        description: response.data.message,
      });

      onEmailUpdate();
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error("Failed to update email", {
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Email Address</DialogTitle>
        </DialogHeader>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Email verification required</p>
              <p>
                You'll need to verify your new email address before the change
                takes effect.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Email */}
          <div className="space-y-2">
            <Label>Current Email</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
              {currentEmail}
            </div>
          </div>

          {/* New Email */}
          <div className="space-y-2">
            <Label htmlFor="newEmail">New Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="newEmail"
                type="email"
                placeholder="Enter your new email address"
                className="pl-10"
                {...form.register("newEmail")}
              />
            </div>
            {form.formState.errors.newEmail && (
              <p className="text-sm text-red-600">
                {form.formState.errors.newEmail.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Email"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
