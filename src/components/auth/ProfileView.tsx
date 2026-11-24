"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, MapPin, Package, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { addressesService } from "@/services/addresses.service";
import { getErrorMessage } from "@/services/api";
import { toast } from "@/store/toast.store";
import Spinner from "@/components/ui/Spinner";
import type { SavedAddress } from "@/types";

export default function ProfileView() {
  const user = useAuthStore((s) => s.user);
  const [addresses, setAddresses] = useState<SavedAddress[] | null>(null);
  const [form, setForm] = useState({ name: "", details: "", phone: "", city: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { setAddresses(await addressesService.list()); } catch (e) { setAddresses([]); toast.error(getErrorMessage(e, "Couldn't load your addresses.")); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || form.details.trim().length < 5 || !/^01[0125][0-9]{8}$/.test(form.phone) || !form.city.trim()) {
      toast.error("Fill in every field. Phone must be an Egyptian mobile number.");
      return;
    }
    setSaving(true);
    try {
      setAddresses(await addressesService.add(form));
      setForm({ name: "", details: "", phone: "", city: "" });
      toast.success("Address saved");
    } catch (err) { toast.error(getErrorMessage(err, "Couldn't save the address.")); } finally { setSaving(false); }
  }

  async function remove(id: string) {
    try { setAddresses(await addressesService.remove(id)); toast.success("Address removed"); } catch (err) { toast.error(getErrorMessage(err, "Couldn't remove the address.")); }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <div className="card p-6">
          <p className="text-xl font-extrabold">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <nav className="card divide-y divide-gray-100 text-sm font-medium" aria-label="Account">
          <Link href="/orders" className="flex items-center gap-3 p-4 hover:bg-primary-50"><Package className="h-4 w-4 text-primary-600" /> My orders</Link>
          <Link href="/change-password" className="flex items-center gap-3 p-4 hover:bg-primary-50"><KeyRound className="h-4 w-4 text-primary-600" /> Change password</Link>
        </nav>
      </aside>

      <section aria-labelledby="addr-title" className="space-y-6">
        <h2 id="addr-title" className="flex items-center gap-2 text-xl font-bold"><MapPin className="h-5 w-5 text-primary-600" /> Saved addresses</h2>
        {addresses === null ? <Spinner className="text-primary-600" /> : addresses.length === 0 ? (
          <p className="text-sm text-gray-500">No saved addresses yet. Add one below and it will be available at checkout.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {addresses.map((a) => (
              <li key={a._id} className="card flex items-start justify-between gap-3 p-4 text-sm">
                <div><p className="font-semibold">{a.name}</p><p className="text-gray-600">{a.details}, {a.city}</p><p className="text-gray-500">{a.phone}</p></div>
                <button onClick={() => void remove(a._id)} aria-label={`Remove ${a.name}`} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={add} className="card grid gap-4 p-5 sm:grid-cols-2" noValidate>
          <h3 className="font-semibold sm:col-span-2">Add an address</h3>
          {([["name", "Label (e.g. Home)"], ["city", "City"], ["details", "Street address"], ["phone", "Phone (01012345678)"]] as const).map(([key, label]) => (
            <div key={key} className={key === "details" ? "sm:col-span-2" : ""}>
              <label htmlFor={`a-${key}`} className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
              <input id={`a-${key}`} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="input" />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn-primary sm:col-span-2">{saving && <Spinner className="h-4 w-4" />} Save address</button>
        </form>
      </section>
    </div>
  );
}
