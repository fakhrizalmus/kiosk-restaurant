# Frontend Architecture

Struktur frontend ini memakai pola feature-first di atas Next.js App Router.

## Folder utama

- `app`: routing, route layout, route page, metadata, dan global CSS.
- `features`: UI dan logic yang spesifik domain atau halaman.
- `components`: komponen reusable lintas fitur, termasuk `ui` design system.
- `services`: wrapper API/client request ke backend.
- `lib`: konfigurasi teknis dan utilitas umum.
- `hooks`: React hooks reusable lintas fitur.

## Aturan penempatan

- Simpan file route Next.js hanya di `app`, seperti `page.tsx` dan `layout.tsx`.
- Jika sebuah komponen hanya dipakai oleh satu domain, taruh di `features/<domain>`.
- Jika sebuah komponen dipakai banyak domain, taruh di `components`.
- API call ke backend taruh di `services`, bukan di folder route.
- Hindari import dari `app` ke luar `app`; fitur dan komponen sebaiknya import dari `features`, `components`, `services`, `lib`, atau `hooks`.

## Pola contoh

```txt
src/
  app/
    (admin)/
      product/page.tsx
  features/
    admin/
      product/
        addmodal.tsx
        columns.tsx
        data-table.tsx
        editmodal.tsx
  services/
    admin-api.ts
```

Route page menjadi entry point tipis, sedangkan implementation detail tinggal di `features`.
