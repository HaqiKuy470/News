import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'advertisement',
  title: 'Manajemen Iklan Manual',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nama Klien / Iklan',
      type: 'string',
    }),
    defineField({
      name: 'position',
      title: 'Posisi Iklan',
      type: 'string',
      options: {
        list: [
          {title: 'Header (Atas)', value: 'header'},
          {title: 'Sidebar (Samping)', value: 'sidebar'},
          {title: 'Footer (Bawah)', value: 'footer'},
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Banner Iklan',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'url',
      title: 'Link Tujuan (Kalau diklik)',
      type: 'url',
    }),
    defineField({
      name: 'active',
      title: 'Status Aktif',
      type: 'boolean',
      initialValue: true,
      description: 'Jika dimatikan, slot akan kembali menampilkan Google Ads',
    }),
  ],
})