import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'writer',
  title: 'Data Penulis (Community)',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email User',
      type: 'string',
      readOnly: true, 
    }),
    // 1. FIELD BARU: NAMA LENGKAP
    defineField({
      name: 'fullName',
      title: 'Nama Lengkap (Sesuai KTP)',
      type: 'string',
    }),
    // 2. FIELD BARU: FOTO IDENTITAS
    defineField({
      name: 'identityCard',
      title: 'Foto Identitas (KTP/Kartu Pelajar)',
      type: 'image',
      options: { hotspot: true },
      description: 'Bukti identitas asli penulis.'
    }),
    defineField({
        name: 'status',
        title: 'Status Akun',
        type: 'string',
        options: {
            list: [
                {title: 'Menunggu Verifikasi', value: 'pending'},
                {title: 'Diterima (Approved)', value: 'approved'},
                {title: 'Ditolak (Rejected)', value: 'rejected'},
            ]
        },
        initialValue: 'pending'
    }),
    defineField({
        name: 'applicationReason',
        title: 'Alasan Mendaftar',
        type: 'text',
        readOnly: true
    }),
    // ... Data Bank (sama seperti sebelumnya) ...
    defineField({ name: 'bankName', title: 'Nama Bank', type: 'string' }),
    defineField({ name: 'accountNumber', title: 'Nomor Rekening', type: 'string' }),
    defineField({ name: 'accountHolder', title: 'Atas Nama Rekening', type: 'string' }),
    defineField({ name: 'walletBalance', title: 'Saldo', type: 'number', initialValue: 0 }),
  ],
})