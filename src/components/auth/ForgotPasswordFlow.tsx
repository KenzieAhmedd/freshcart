"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";
import Spinner from "@/components/ui/Spinner";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/services/api";
import { toast } from "@/store/toast.store";
import { forgotEmailSchema, newPasswordSchema, resetCodeSchema } from "@/utils/validation";

type Step = "email" | "code" | "password";

export default function ForgotPasswordFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  const emailForm = useForm<{ email: string }>({ resolver: zodResolver(forgotEmailSchema) });
  const codeForm = useForm<{ resetCode: string }>({ resolver: zodResolver(resetCodeSchema) });
  const passForm = useForm<{ newPassword: string; confirm: string }>({ resolver: zodResolver(newPasswordSchema) });

  async function sendCode({ email: value }: { email: string }) {
    setFormError("");
    try {
      await authService.forgotPassword(value);
      setEmail(value);
      toast.success("Reset code sent. Check your inbox.");
      setStep("code");
    } catch (e) { setFormError(getErrorMessage(e, "We couldn't send a reset code.")); }
  }

  async function verify({ resetCode }: { resetCode: string }) {
    setFormError("");
    try {
      await authService.verifyResetCode(resetCode);
      setStep("password");
    } catch (e) { setFormError(getErrorMessage(e, "That code is invalid or has expired.")); }
  }

  async function reset({ newPassword }: { newPassword: string }) {
    setFormError("");
    try {
      await authService.resetPassword(email, newPassword);
      toast.success("Password updated. Sign in with your new password.");
      router.replace("/login");
    } catch (e) { setFormError(getErrorMessage(e, "We couldn't reset your password.")); }
  }

  const err = formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>;

  if (step === "email") return (
    <form onSubmit={emailForm.handleSubmit(sendCode)} noValidate className="space-y-4">
      {err}
      <FormField label="Email" type="email" autoComplete="email" error={emailForm.formState.errors.email?.message} {...emailForm.register("email")} />
      <button type="submit" disabled={emailForm.formState.isSubmitting} className="btn-primary w-full">{emailForm.formState.isSubmitting && <Spinner className="h-4 w-4" />} Send reset code</button>
    </form>
  );

  if (step === "code") return (
    <form onSubmit={codeForm.handleSubmit(verify)} noValidate className="space-y-4">
      <p className="text-sm text-gray-600">We sent a code to <strong>{email}</strong>.</p>
      {err}
      <FormField label="Reset code" inputMode="numeric" autoComplete="one-time-code" error={codeForm.formState.errors.resetCode?.message} {...codeForm.register("resetCode")} />
      <button type="submit" disabled={codeForm.formState.isSubmitting} className="btn-primary w-full">{codeForm.formState.isSubmitting && <Spinner className="h-4 w-4" />} Verify code</button>
      <button type="button" onClick={() => { setFormError(""); setStep("email"); }} className="w-full text-sm font-medium text-primary-700 hover:underline">Use a different email</button>
    </form>
  );

  return (
    <form onSubmit={passForm.handleSubmit(reset)} noValidate className="space-y-4">
      {err}
      <FormField label="New password" type="password" autoComplete="new-password" error={passForm.formState.errors.newPassword?.message} {...passForm.register("newPassword")} />
      <FormField label="Confirm new password" type="password" autoComplete="new-password" error={passForm.formState.errors.confirm?.message} {...passForm.register("confirm")} />
      <button type="submit" disabled={passForm.formState.isSubmitting} className="btn-primary w-full">{passForm.formState.isSubmitting && <Spinner className="h-4 w-4" />} Update password</button>
    </form>
  );
}
