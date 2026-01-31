"use client"

import {NextStudio} from 'next-sanity/studio'
import config from '../../../sanity.config' // Pastikan path ini mengarah ke sanity.config.ts

export default function StudioPage() {
  return <NextStudio config={config} />
}