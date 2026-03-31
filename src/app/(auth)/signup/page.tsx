"use client";

import { useState } from "react";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await signup(formData);
    if (result && !result.ok) {
      setError(result.error.message);
      setPending(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl text-gold">Join By Order</CardTitle>
        <CardDescription>Start building your empire today</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm text-text-secondary">
              Username
            </label>
            <Input id="username" name="username" required minLength={3} maxLength={20} />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-text-secondary">
              Email
            </label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-text-secondary">
              Password
            </label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account..." : "Start Your Empire"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:text-gold-hover transition-colors">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
