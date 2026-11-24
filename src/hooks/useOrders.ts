"use client";

import { useCallback, useEffect, useState } from "react";
import { ordersService } from "@/services/orders.service";
import { getErrorMessage } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import type { Order } from "@/types";

export function useOrders() {
  const userId = useAuthStore((s) => s.user?.id);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!userId) return;
    setError("");
    try {
      setOrders(await ordersService.listForUser(userId));
    } catch (e) {
      setError(getErrorMessage(e, "We couldn't load your orders."));
    }
  }, [userId]);

  useEffect(() => { void load(); }, [load]);

  return { orders, error, reload: load, ready: hydrated, noUser: hydrated && !userId };
}
