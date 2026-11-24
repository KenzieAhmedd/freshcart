"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CreditCard, ShoppingCart } from "lucide-react";
import FormField from "@/components/ui/FormField";
import Spinner, { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { useCartStore } from "@/store/cart.store";
import { ordersService } from "@/services/orders.service";
import { paymentService } from "@/services/payment.service";
import { addressesService } from "@/services/addresses.service";
import { getErrorMessage } from "@/services/api";
import { toast } from "@/store/toast.store";
import { shippingSchema, type ShippingValues } from "@/utils/validation";
import { cn, formatPrice } from "@/utils/format";
import type { SavedAddress } from "@/types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, loaded } = useCartStore();
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { payment: "cash" },
  });
  const payment = watch("payment");

  useEffect(() => {
    addressesService.list().then(setSaved).catch(() => setSaved([]));
  }, []);

  if (!loaded) return <PageSpinner label="Preparing checkout…" />;
  if (cart.products.length === 0 || !cart.cartId) {
    return <EmptyState icon={ShoppingCart} title="Nothing to check out" description="Your cart is empty." actionLabel="Browse products" actionHref="/products" />;
  }

  const unavailable = cart.products.filter((p) => p.product.quantity < 1 || p.count > p.product.quantity);
  const cartId = cart.cartId;

  async function onSubmit(v: ShippingValues) {
    setFormError("");
    const shippingAddress = { details: v.details, phone: v.phone, city: v.city };
    try {
      if (v.payment === "cash") {
        await ordersService.createCashOrder(cartId, shippingAddress);
        // The API empties the cart when the order is created.
        useCartStore.getState().reset();
        await useCartStore.getState().fetch();
        toast.success("Order placed. You'll pay on delivery.");
        router.replace("/orders?placed=cash");
      } else {
        const origin = SITE_URL || window.location.origin;
        const url = await paymentService.createCheckoutSession(cartId, shippingAddress, origin);
        window.location.assign(url); // hosted payment page
      }
    } catch (e) {
      setFormError(getErrorMessage(e, v.payment === "cash" ? "We couldn't place your order." : "We couldn't start the payment."));
    }
  }

  function applyAddress(id: string) {
    const a = saved.find((s) => s._id === id);
    if (!a) return;
    setValue("details", a.details, { shouldValidate: true });
    setValue("phone", a.phone, { shouldValidate: true });
    setValue("city", a.city, { shouldValidate: true });
  }

  const options = [
    { value: "cash" as const, title: "Cash on delivery", text: "Pay when your order arrives.", icon: Banknote },
    { value: "online" as const, title: "Pay online", text: "Secure card payment on a hosted page.", icon: CreditCard },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <section className="card space-y-4 p-6" aria-labelledby="ship-title">
          <h2 id="ship-title" className="text-lg font-bold">Delivery information</h2>
          {saved.length > 0 && (
            <div>
              <label htmlFor="saved" className="mb-1.5 block text-sm font-medium text-gray-700">Use a saved address</label>
              <select id="saved" defaultValue="" onChange={(e) => applyAddress(e.target.value)} className="input">
                <option value="" disabled>Choose an address</option>
                {saved.map((a) => <option key={a._id} value={a._id}>{a.name} · {a.city}</option>)}
              </select>
            </div>
          )}
          <FormField label="Street address" autoComplete="street-address" placeholder="Street, building, apartment" error={errors.details?.message} {...register("details")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="City" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
            <FormField label="Phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01012345678" error={errors.phone?.message} {...register("phone")} />
          </div>
        </section>

        <fieldset className="card p-6">
          <legend className="px-1 text-lg font-bold">Payment method</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {options.map(({ value, title, text, icon: Icon }) => (
              <label key={value} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors", payment === value ? "border-primary-600 bg-primary-50" : "border-gray-200 hover:border-gray-300")}>
                <input type="radio" value={value} className="mt-1 accent-primary-600" {...register("payment")} />
                <span><span className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 text-primary-600" />{title}</span><span className="mt-0.5 block text-sm text-gray-500">{text}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <div className="card p-6">
          <h2 className="text-lg font-bold">Order summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.products.map((it) => (
              <li key={it._id} className="flex items-center gap-3 text-sm">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50"><Image src={it.product.imageCover} alt="" fill sizes="48px" className="object-cover" /></span>
                <span className="line-clamp-2 flex-1">{it.product.title} <span className="text-gray-400">× {it.count}</span></span>
                <span className="font-medium">{formatPrice(it.price * it.count)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd>{formatPrice(cart.totalCartPrice)}</dd></div>
            <div className="flex justify-between text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-primary-700">{formatPrice(cart.totalCartPrice)}</dd></div>
          </dl>

          {unavailable.length > 0 && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Some items are unavailable in the quantity you chose. <Link href="/cart" className="font-semibold underline">Review your cart</Link>.</p>
          )}
          {formError && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}

          <button type="submit" disabled={isSubmitting || unavailable.length > 0} className="btn-primary mt-5 w-full">
            {isSubmitting && <Spinner className="h-4 w-4" />}
            {payment === "cash" ? "Place order" : "Continue to payment"}
          </button>
          <Link href="/cart" className="mt-3 block text-center text-sm font-medium text-primary-700 hover:underline">Back to cart</Link>
        </div>
      </aside>
    </form>
  );
}
