import { Facet } from '../db.js'

export function decodeFacets(facetsJson: string | null): Facet[] | null {
  if (!facetsJson) return null
  try {
    return JSON.parse(facetsJson)
  } catch {
    return null
  }
}

export function encodeFacets(facets: Facet[] | null): string | null {
  if (!facets) return null
  return JSON.stringify(facets)
}
