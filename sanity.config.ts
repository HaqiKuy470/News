import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './sanity/schemaTypes' // Updated path and import

export default defineConfig({
  name: 'default',
  title: 'Arshaka News',

  projectId: '0plflboe', // Jangan ubah kode ini
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schema.types,
  },

  basePath: '/studio', // <--- PASTIKAN INI '/studio' (bukan '/y')
})