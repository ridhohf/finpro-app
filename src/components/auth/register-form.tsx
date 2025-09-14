"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authService } from "@/app/services/auth.service";
import { ApiError } from "@/lib/api";

const formSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    role: z.enum(["USER", "TENANT"]),
    name: z.string().min(2, "Nama minimal 2 karakter").optional(),
    companyName: z
      .string()
      .min(2, "Nama perusahaan minimal 2 karakter")
      .optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "TENANT") {
        return data.companyName && data.companyName.length >= 2;
      }
      return true;
    },
    {
      message: "Nama perusahaan diperlukan untuk tenant",
      path: ["companyName"],
    }
  );

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "USER",
      name: "",
      companyName: "",
      phone: "",
      address: "",
    },
  });

  const watchRole = form.watch("role");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError("");

      const registrationData = {
        email: values.email,
        role: values.role,
        name: values.name,
        ...(values.role === "TENANT" && {
          companyName: values.companyName,
          phone: values.phone,
          address: values.address,
        }),
      };

      await authService.register(registrationData);

      alert("Email verifikasi telah dikirim. Silakan cek email Anda.");
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@contoh.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daftar Sebagai</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="USER" />
                      </FormControl>
                      <FormLabel className="font-normal">User</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="TENANT" />
                      </FormControl>
                      <FormLabel className="font-normal">Tenant</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchRole === "TENANT" && (
            <>
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Perusahaan *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama perusahaan Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat perusahaan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Daftar"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Sudah punya akun?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-primary hover:underline"
        >
          Masuk di sini
        </button>
      </div>
    </div>
  );
}
