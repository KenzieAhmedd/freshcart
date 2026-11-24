"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { productsService } from "@/services/products.service";
import { getErrorMessage } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/store/toast.store";
import { formatDate } from "@/utils/format";
import Spinner from "@/components/ui/Spinner";
import type { Review } from "@/types";

export default function ProductReviews({ productId }: { productId: string }) {
  const token = useAuthStore((s) => s.token);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setReviews(await productsService.reviews(productId));
      setError("");
    } catch (e) {
      setError(getErrorMessage(e, "Couldn't load reviews."));
    }
  }, [productId]);

  useEffect(() => { void load(); }, [load]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (text.trim().length < 2) { toast.error("Write a short review first."); return; }
    setSubmitting(true);
    try {
      await productsService.addReview(productId, text.trim(), rating);
      toast.success("Thanks for your review!");
      setText("");
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't post your review."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="reviews-title" className="space-y-6">
      <h2 id="reviews-title" className="text-xl font-bold">Customer reviews</h2>

      {token ? (
        <form onSubmit={submit} className="card space-y-4 p-5">
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)}>
                <Star className={`h-7 w-7 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <label htmlFor="review-text" className="sr-only">Your review</label>
          <textarea id="review-text" value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="What did you think of this product?" className="input" />
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? <Spinner className="h-4 w-4" /> : null} Post review</button>
        </form>
      ) : (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          <Link href="/login" className="font-semibold text-primary-700 hover:underline">Sign in</Link> to write a review.
        </p>
      )}

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : reviews === null ? (
        <div className="flex justify-center py-6"><Spinner className="text-primary-600" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.user?.name ?? "Customer"}</p>
                <time className="text-xs text-gray-400" dateTime={r.createdAt}>{formatDate(r.createdAt)}</time>
              </div>
              <div className="mt-1 flex" aria-label={`${r.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />)}
              </div>
              <p className="mt-2 text-sm text-gray-700">{r.review}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
