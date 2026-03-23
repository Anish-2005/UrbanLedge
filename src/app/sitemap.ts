import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/properties', changeFrequency: 'daily', priority: 0.9 },
    { path: '/assessments', changeFrequency: 'daily', priority: 0.9 },
    { path: '/payments', changeFrequency: 'daily', priority: 0.9 },
    { path: '/demo', changeFrequency: 'monthly', priority: 0.5 },
  ]

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
