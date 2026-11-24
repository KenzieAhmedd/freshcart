import { z } from "zod";

const email = z.string().trim().min(1, "Enter your email").email("Enter a valid email address");
const password = z.string().min(6, "Use at least 6 characters");
const egyptPhone = z.string().trim().regex(/^01[0125][0-9]{8}$/, "Enter an Egyptian mobile number, e.g. 01012345678");

export const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password") });

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters").max(30, "Name can be up to 30 characters"),
    email,
    phone: egyptPhone,
    password,
    rePassword: z.string().min(1, "Confirm your password"),
    terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms to continue" }) }),
  })
  .refine((d) => d.password === d.rePassword, { path: ["rePassword"], message: "Passwords don't match" });

export const forgotEmailSchema = z.object({ email });
export const resetCodeSchema = z.object({ resetCode: z.string().trim().regex(/^\d{4,8}$/, "Enter the numeric code from your email") });
export const newPasswordSchema = z
  .object({ newPassword: password, confirm: z.string().min(1, "Confirm your password") })
  .refine((d) => d.newPassword === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password,
    rePassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.password === d.rePassword, { path: ["rePassword"], message: "Passwords don't match" })
  .refine((d) => d.password !== d.currentPassword, { path: ["password"], message: "Choose a password different from your current one" });

export const shippingSchema = z.object({
  details: z.string().trim().min(5, "Enter your street address and building details"),
  phone: egyptPhone,
  city: z.string().trim().min(2, "Enter your city"),
  payment: z.enum(["cash", "online"]),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ShippingValues = z.infer<typeof shippingSchema>;
