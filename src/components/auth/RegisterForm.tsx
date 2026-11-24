"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";
import Spinner from "@/components/ui/Spinner";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/store/toast.store";
import { registerSchema, type RegisterValues } from "@/utils/validation";

export default function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(v: RegisterValues) {
    setFormError("");
    try {
      const res = await authService.register({ name: v.name, email: v.email, phone: v.phone, password: v.password, rePassword: v.rePassword });
      if (res.token) {
        setSession(res.token, res.user);
        toast.success("Account created. Welcome to FreshCart!");
        router.replace("/");
        router.refresh();
      } else {
        toast.success("Account created. Please sign in.");
        router.replace("/login");
      }
    } catch (e) {
      setFormError(getErrorMessage(e, "We couldn't create your account."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <FormField label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <FormField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <FormField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="01012345678" error={errors.phone?.message} {...register("phone")} />
      <FormField label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <FormField label="Confirm password" type="password" autoComplete="new-password" error={errors.rePassword?.message} {...register("rePassword")} />
      <div>
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" className="mt-1 accent-primary-600" {...register("terms")} />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>
        {errors.terms && <p role="alert" className="mt-1 text-xs text-red-600">{errors.terms.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting && <Spinner className="h-4 w-4" />} Create Account</button>
    </form>
  );
}
