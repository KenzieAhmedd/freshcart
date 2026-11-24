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
import { changePasswordSchema } from "@/utils/validation";

interface Values { currentPassword: string; password: string; rePassword: string }

export default function ChangePasswordForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(v: Values) {
    setFormError("");
    try {
      const res = await authService.changePassword(v.currentPassword, v.password, v.rePassword);
      // The old token stops working after a password change, so keep the session alive with the new one.
      if (res.token) setSession(res.token);
      toast.success("Password changed");
      reset();
      router.push("/profile");
    } catch (e) {
      setFormError(getErrorMessage(e, "We couldn't change your password."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <FormField label="Current password" type="password" autoComplete="current-password" error={errors.currentPassword?.message} {...register("currentPassword")} />
      <FormField label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <FormField label="Confirm new password" type="password" autoComplete="new-password" error={errors.rePassword?.message} {...register("rePassword")} />
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting && <Spinner className="h-4 w-4" />} Change password</button>
    </form>
  );
}
