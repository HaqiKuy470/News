import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId: '0plflboe', // <--- Ganti dengan kode acak Mas (cek sanity.config.ts)
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set false biar update instan
})