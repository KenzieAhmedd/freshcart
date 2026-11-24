# FreshCart – Next.js E-Commerce

A full e-commerce storefront built with **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Zustand · React Hook Form + Zod · Axios · Lucide**.
Design follows the reference demo (https://ecommerce-route-ashen.vercel.app/); data and actions come from the Route e-commerce REST API.

## Quick start

```bash
npm install
cp .env.example .env.local     # already present with sensible defaults
npm run dev                    # http://localhost:3000
```

Production: `npm run build && npm start`. Type check: `npm run typecheck`.

### Environment variables (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API base, e.g. `https://ecommerce.routemisr.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | This site's public origin. Sent as `?url=` when starting online payment so the provider returns the buyer here. Set it to your deployed URL in production. |

> The build uses `next/font/google` (Inter), so the machine running `next build` needs internet access to fonts.googleapis.com.

## Structure

```
src/
├── app/              routes: (auth)/login|register|forgot-password|change-password, products[/id],
│                     brands[/id], categories[/id], cart, wishlist, checkout, orders[/id], profile, deals, [slug] info pages
├── components/       layout, home, products, cart, wishlist, auth, checkout, orders, ui
├── services/         api.ts (axios + token header + 401 handling) and one service per feature
├── store/            Zustand: auth (persisted), cart, wishlist, toast
├── hooks/  types/  utils/  styles/
└── middleware.ts     redirects signed-out users away from protected pages
```

Server Components fetch catalog data (home, listings, details). Client Components handle auth, cart, wishlist, checkout and forms.

## API endpoints used (base `…/api/v1`)

Auth token is sent in a `token` header (the Route API's convention), not `Authorization`.

| Feature | Endpoint |
| --- | --- |
| Register / Login | `POST /auth/signup`, `POST /auth/signin` |
| Forgot password | `POST /auth/forgotPasswords` → `POST /auth/verifyResetCode` → `PUT /auth/resetPassword` |
| Change password | `PUT /users/changeMyPassword` |
| Products | `GET /products` (page, limit, sort, keyword, category, brand, subcategory, price[gte], price[lte]), `GET /products/:id` |
| Reviews | `GET /products/:id/reviews`, `POST /products/:id/reviews` |
| Categories | `GET /categories`, `GET /categories/:id`, `GET /categories/:id/subcategories` |
| Brands | `GET /brands`, `GET /brands/:id` |
| Cart | `GET /cart`, `POST /cart`, `PUT /cart/:productId`, `DELETE /cart/:productId`, `DELETE /cart` |
| Wishlist | `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/:productId` |
| Cash on delivery | `POST /orders/:cartId` |
| Online payment | `POST /orders/checkout-session/:cartId?url=<SITE_URL>` → redirect to the returned session URL |
| Orders | `GET /orders/user/:userId` (user id is read from the JWT payload) |
| Saved addresses | `GET/POST /addresses`, `DELETE /addresses/:id` |

## Important: verify before shipping

The Postman page for this API renders its endpoint list with JavaScript, so it could not be read automatically while this project was built. Endpoint paths, request bodies and response shapes were written from the public Route API conventions and cross-checked against open-source Route projects. **Nothing here has been run against the live API** (the build environment could not reach it). Please run through these flows once and tell me anything that differs from the Postman docs:

1. Register → Login → token persists after refresh.
2. Add to cart / change quantity / remove; add to wishlist / remove.
3. Cash order; online payment redirect and return.
4. Filters: `category`, `brand`, `price[gte]/price[lte]` and `sort` values on `/products`.

## Known limitations

- **No single-order endpoint.** Order details are read from the user's order list.
- **Online payment return URL.** After payment the provider sends the buyer back to this site; `/allorders` is redirected to `/orders`. If the API redirects somewhere else, update `next.config.mjs`. Order paid status comes from the API (`isPaid`).
- **Order status** is derived from `isDelivered` (Delivered / Processing); the API has no richer status.
- **Deals** page scans the first 100 products for discounts (the API has no "on sale" filter).
- **Newsletter, app-store badges, static info pages** have no backend; the newsletter form validates and confirms locally only.
- Shipping/tax are shown as returned on the order; the cart shows subtotal and total only.
