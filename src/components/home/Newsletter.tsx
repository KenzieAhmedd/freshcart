"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "@/store/toast.store";

/** The Route API has no newsletter endpoint, so this form validates the address and confirms locally only. */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { toast.error("Enter a valid email address."); return; }
    setDone(true);
  }

  return (
    <section className="container-fc mt-16">
      <div className="rounded-3xl bg-primary-50 px-6 py-12 text-center sm:px-12">
        <Mail className="mx-auto h-10 w-10 text-primary-600" />
        <h2 className="mt-4 text-3xl font-extrabold">Get the Freshest Updates Delivered Free</h2>
        <p className="mx-auto mt-2 max-w-xl text-gray-600">Weekly offers, new arrivals and member perks.</p>
        {done ? (
          <p role="status" className="mt-6 font-semibold text-primary-700">Thanks! You're on the list.</p>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="input flex-1" />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        )}
        <p className="mt-3 text-xs text-gray-500">Unsubscribe anytime. No spam.</p>
      </div>
    </section>
  );
}
