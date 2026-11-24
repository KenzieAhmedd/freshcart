import TopBarAuth from "./TopBarAuth";
import { Mail, Phone, Truck } from "lucide-react";

export default function TopBar() {
  return (
    <div className="hidden border-b border-gray-100 bg-gray-50 text-xs text-gray-600 md:block">
      <div className="container-fc flex h-10 items-center justify-between">
        <p className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary-600" />
          Free Shipping on Orders 500 EGP · New Arrivals Daily
        </p>
        <div className="flex items-center gap-5">
          <a href="tel:+18001234567" className="flex items-center gap-1.5 hover:text-primary-600">
            <Phone className="h-3.5 w-3.5" /> +1 (800) 123-4567
          </a>
          <a href="mailto:support@freshcart.com" className="flex items-center gap-1.5 hover:text-primary-600">
            <Mail className="h-3.5 w-3.5" /> support@freshcart.com
          </a>
          <TopBarAuth />
        </div>
      </div>
    </div>
  );
}

