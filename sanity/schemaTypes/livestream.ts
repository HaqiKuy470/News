import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'livestream',
  title: 'Setting Live TV',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Acara (Headline)',
      type: 'string',
      description: 'Contoh: Breaking News: Gempa di Cianjur',
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Singkat',
      type: 'text',
      description: 'Penjelasan singkat tentang acara yang sedang tayang.',
    }),
    defineField({
      name: 'videoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Masukkan ID-nya saja (Contoh: bNyUyrvbCx4). Jangan link lengkap!',
    }),
    defineField({
      name: 'nextProgram',
      title: 'Acara Selanjutnya',
      type: 'string',
      description: 'Contoh: Analisis Crypto (14:00 WIB)',
    }),
  ],
})