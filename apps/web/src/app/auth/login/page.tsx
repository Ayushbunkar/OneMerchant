"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const loginSchema = z.object({
  id: z.string().min(1, "ID is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError("");
    try {
      // simulated delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const success = login(data.id, data.password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid ID or Password");
      }
    } catch (err: any) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      
      <Card className="w-full max-w-md glass border-white/10 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">OM</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your ID and password to login</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" type="text" placeholder="user123" {...register("id")} />
              {errors.id && <p className="text-xs text-destructive">{errors.id.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Go back to <Link href="/" className="text-primary hover:underline">Home</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
