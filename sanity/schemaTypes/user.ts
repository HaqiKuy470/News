import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'user',
  title: 'User Account',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama User',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'password',
      title: 'Hashed Password',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Foto Profil',
      type: 'image',
    }),
    defineField({
      name: 'resetToken',
      title: 'Token Reset Password',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetTokenExpiry',
      title: 'Token Expired Time',
      type: 'number',
      hidden: true,
    }),
  ],
})