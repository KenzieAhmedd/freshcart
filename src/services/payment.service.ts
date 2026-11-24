import { api } from "./api";
import type { ShippingAddress } from "@/types";

export const paymentService = {
  /**
   * Online payment: asks the API for a hosted checkout session and returns its URL.
   * `returnUrl` is this site's origin; the payment provider sends the buyer back to it.
   */
  async createCheckoutSession(cartId: string, shippingAddress: ShippingAddress, returnUrl: string) {
    const { data } = await api.post<{ status: string; session: { url: string; id?: string } }>(
      `/orders/checkout-session/${cartId}`,
      { shippingAddress },
      { params: { url: returnUrl } }
    );
    if (!data.session?.url) throw new Error("The payment provider did not return a checkout link.");
    return data.session.url;
  },
};
