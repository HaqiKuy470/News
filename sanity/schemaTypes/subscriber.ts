import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'subscriber',
  title: 'Subscriber (API Users)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama User/Perusahaan',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'apiKey',
      title: 'API Key',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Banned', value: 'banned'}
        ],
      },
      initialValue: 'active'
    }),
  ],
})