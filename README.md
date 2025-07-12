Nama : Arya Fian Saputra

Aplikasi e-commerce modern yang dibangun dengan Next.js 15, React, TypeScript, dan Tailwind CSS. Aplikasi ini menyediakan katalog produk lengkap dengan sistem review dan wishlist.

Fitur Utama

  # 1. Halaman Daftar Produk
- API Integration: Mengambil data dari FakeStore API (https://fakestoreapi.com/products)
- Search Functionality: Pencarian produk berdasarkan nama dan deskripsi
- Category Filter: Filter produk berdasarkan kategori
- Loading States: Indikator loading saat fetch data
- Responsive Design: Tampilan optimal di semua perangkat
- Wishlist Integration: Tombol add/remove wishlist di setiap produk

  # 2. Halaman Detail Produk
- Dynamic Routing: URL `/product/[id]` untuk setiap produk
- **Complete Product Info**: Menampilkan semua detail produk
- Wishlist Management: Fungsi add/remove dari wishlist
- Review Form: Form review dengan validasi lengkap
  - Nama (wajib diisi)
  - Email (valid email, wajib diisi)
  - Rating (dropdown 1-5, wajib diisi)
  - Komentar (wajib diisi)
- Form Validation: Validasi real-time dengan pesan error
- Success Notification: Notifikasi sukses setelah submit
- Form Reset: Form direset setelah submit berhasil

  # 3. Halaman Wishlist
- Persistent Storage: Data wishlist disimpan di localStorage
- Product Management: Tampilan produk yang ditambahkan ke wishlist
- Remove Functionality: Hapus produk individual atau clear all
- Empty State: Tampilan khusus saat wishlist kosong

  # TechStack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Icons: Lucide React
- State Management: React Context API + localStorage
- Form Handling: React Hook Form pattern dengan validasi custom
