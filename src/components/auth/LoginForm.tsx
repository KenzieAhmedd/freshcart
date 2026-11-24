"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";
import Spinner from "@/components/ui/Spinner";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/store/toast.store";
import { loginSchema, type LoginValues } from "@/utils/validation";
import { safeRedirect } from "@/utils/format";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setFormError("");
    try {
      const res = await authService.login(values.email, values.password);
      setSession(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`);
      router.replace(safeRedirect(params.get("redirect")));
      router.refresh();
    } catch (e) {
      setFormError(getErrorMessage(e, "Sign in failed. Check your email and password."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <FormField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <FormField label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
      <div className="text-right"><Link href="/forgot-password" className="text-sm font-medium text-primary-700 hover:underline">Forgot password?</Link></div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting && <Spinner className="h-4 w-4" />} Sign In</button>
    </form>
  );
}
