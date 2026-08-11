# Fix broken internal links and remove dead pages

## What's broken (verified)

1. **Our Projects intro paragraph** (`src/pages/MyProjectsPage.tsx:127`) links to `/products/interior-fitouts` (twice) and `/products/fire-rated-doors`. Neither route exists, so they land on a blank screen.
2. **No catch-all route.** `src/App.tsx` has no `*` route, so any unknown URL renders the layout with an empty body instead of the existing NotFound page. This is why bad links look "blank" rather than showing a 404.
3. **Footer product links** (`src/components/layout/Footer.tsx:97-121`) are hardcoded absolute `https://nawakhdha-woodcraft-website-65.lovable.app/product/<uuid>` URLs pointing at the old UUID paths — they leave the custom domain and rely on redirect routes.
4. **Footer "Privacy Policy" / "Terms of Service"** link to `/privacy` and `/terms`, which have no routes and no pages.
5. **Unrouted / dead page files:**
   - `src/pages/Index.tsx` — not routed; redirects to `/home`, which doesn't exist.
   - `src/pages/FurnitureCategoryPage.tsx` — not routed anywhere; also links to `/category`, a nonexistent route.
   - `src/components/auth/ProtectedRoute.tsx` — imported nowhere; redirects to `/admin/login`, a nonexistent route.
6. **Building Maintenance Services** — `/building-maintenance-services` and its `/:slug` detail route are routed, but the `maintenance_categories` table currently has **0 rows**, so the page renders an empty listing. Verified by query.

All `/product/*-bahrain` links used on the Aluminium, Gypsum and product pages match real `product_categories.category_slug` values — those are fine.

## Fixes to apply

- Rewrite the Our Projects paragraph links: custom furniture → `/products`, interior fit-outs → `/interior-fitouts-bahrain`, wooden doors → `/fire-rated-doors-bahrain`.
- Add `<Route path="*" element={<NotFound />} />` in `src/App.tsx` so future bad URLs show a real 404 rather than a blank page.
- Convert the four footer product links to internal `<Link>`s using current slugs (`/product/modern-design-doors-bahrain`, `/product/kitchen-cabinets-bahrain`, `/product/bedroom-furniture-bahrain`, `/product/dining-tables-chairs-bahrain`).
- Remove the `/privacy` and `/terms` footer links (no such pages exist).

## Deletions — need your confirmation

| File / route | Why |
|---|---|
| `src/pages/Index.tsx` | Unrouted, points at nonexistent `/home` |
| `src/pages/FurnitureCategoryPage.tsx` | Unrouted, unreachable, links to nonexistent `/category` |
| `src/components/auth/ProtectedRoute.tsx` | Unused component, links to nonexistent `/admin/login` |
| `/building-maintenance-services` pages + routes | Renders empty (0 categories in the database) |

For Building Maintenance Services there are two options — tell me which you want:
- **A:** Keep the pages and routes as-is (they'll fill in once you add categories in the admin panel).
- **B:** Delete both pages, their routes, and their admin tabs / hooks, and drop the URLs from the sitemap.

Deleting the maintenance pages also means removing them from `public/sitemap.xml` and the `generate-sitemap` edge function, plus the maintenance admin tabs.

## Technical notes

Files touched: `src/pages/MyProjectsPage.tsx`, `src/App.tsx`, `src/components/layout/Footer.tsx`, plus the deletions above. No database changes needed.
