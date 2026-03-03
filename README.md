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


## Troubleshooting: clone hanya berisi `.gitkeep`
Jika setelah clone isi repo cuma `.gitkeep`, biasanya branch yang ter-push ke GitHub belum berisi commit terbaru.

Langkah perbaikan (jalankan dari repo lokal yang benar):

```bash
# 1) pastikan remote GitHub ada
git remote add origin <URL_REPO_GITHUB>

# 2) pastikan branch kerja berisi commit terbaru
git checkout work

# 3) publish branch work ke GitHub
git push -u origin work

# 4) jadikan isi branch work sebagai main
git push origin work:main

# 5) di GitHub, set default branch ke main (Settings > Branches)
```

Validasi:

```bash
git ls-remote --heads origin
git log --oneline --decorate -n 5
```
