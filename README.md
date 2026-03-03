# Library Web

Frontend aplikasi perpustakaan dengan stack:
- React + TypeScript
- Tailwind CSS
- Redux Toolkit (auth, ui, cart)
- TanStack Query
- Day.js
- Komponen UI reusable ala shadcn

## Environment
Copy `.env.example` ke `.env`:

```bash
VITE_API_URL=https://library-backend-production-b9cf.up.railway.app
```

## Fitur yang sudah diintegrasikan ke backend
- Auth login/register + simpan token/user ke localStorage.
- Book list + search + filter kategori.
- Book detail + borrow + review list/add/delete.
- Optimistic UI untuk stok saat borrow di halaman detail.
- Cart + confirm borrow (`/api/loans/from-cart`).
- My loans.
- My profile + update profile + statistik dari loans.
- My reviews.
- Admin dashboard ringkas (overview, users, books, loans, overdue) dengan role guard.

## Menjalankan
```bash
npm install
npm run dev
```
