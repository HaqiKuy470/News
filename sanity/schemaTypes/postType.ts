import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Berita', // Label di Dashboard
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Berita',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Link URL (Slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Penulis',
      type: 'string',
      initialValue: 'Admin Arshaka',
    }),
    defineField({
      name: 'mainImage',
      title: 'Gambar Utama',
      type: 'image',
      options: { hotspot: true }, // Bisa crop gambar
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'logi', value: 'logi' },
          { title: 'Bisnis', value: 'bisnis' },
          { title: 'Crypto', value: 'crypto' },
          { title: 'Lifestyle', value: 'lifestyle' },
          { title: 'Lainnya', value: 'lainnya' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    // FITUR PREMIUM (Sesuai Request Poin 6)
    defineField({
      name: 'isPremium',
      title: 'Konten Premium? (Berbayar)',
      description: 'Jika dicentang, berita ini hanya untuk pelanggan berbayar.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Tayang',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Isi Berita',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }], // Bisa tulis teks & sisipkan gambar
    }),
    // ... field title, slug, dll ...

    // TAMBAHKAN INI:
    defineField({
      name: 'authorEmail',
      title: 'Email Penulis External',
      type: 'string',
      readOnly: true, // Diisi otomatis sistem
    }),
    defineField({
      name: 'earnings',
      title: 'Komisi Penulis (Rp)',
      type: 'number',
      initialValue: 0,
      description: 'Isi nominal jika artikel ini berbayar (misal: 15000)',
    }),
    defineField({
      name: 'views',
      title: 'Jumlah Pembaca',
      type: 'number',
      initialValue: 0,
      readOnly: true
    }),

    // ... sisa field body, category dll ...
  ],
})