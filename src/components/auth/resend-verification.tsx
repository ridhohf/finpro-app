"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResendVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="email"
        placeholder="Masukkan email Anda"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleResend} disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
      </Button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </div>
  );
}
