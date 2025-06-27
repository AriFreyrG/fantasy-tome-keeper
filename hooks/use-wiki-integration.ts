'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { wikiService, WikiIntegration, WikiSearchResult, WikiPage } from '@/lib/wiki-integration'

export interface UseWikiSearchOptions {
  enabled?: boolean
  staleTime?: number
}

export function useWikiSearch(
  bookTitle: string, 
  author: string, 
  options: UseWikiSearchOptions = {}
) {
  const { enabled = true, staleTime = 5 * 60 * 1000 } = options

  return useQuery({
    queryKey: ['wiki-search', bookTitle, author],
    queryFn: () => wikiService.searchForBook(bookTitle, author),
    enabled: enabled && !!bookTitle && !!author,
    staleTime,
    retry: 1,
  })
}

export function useWikiPage(title: string, wikis: WikiIntegration[]) {
  return useQuery({
    queryKey: ['wiki-page', title, wikis.map(w => w.id)],
    queryFn: () => wikiService.getCharacterInfo(title, wikis),
    enabled: !!title && wikis.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}

export function useBookWikiData(bookTitle?: string, author?: string) {
  const [selectedWikis, setSelectedWikis] = useState<WikiIntegration[]>([])
  const [selectedResults, setSelectedResults] = useState<WikiSearchResult[]>([])

  const wikiSearchQuery = useWikiSearch(bookTitle || '', author || '', {
    enabled: !!bookTitle && !!author
  })

  useEffect(() => {
    if (wikiSearchQuery.data && wikiSearchQuery.data.length > 0) {
      // Auto-select the first (highest quality) wiki
      const topWiki = wikiSearchQuery.data[0]
      setSelectedWikis([topWiki.wiki])
      setSelectedResults(topWiki.results.slice(0, 5)) // Top 5 results
    }
  }, [wikiSearchQuery.data])

  return {
    // Search results
    wikiSearchResults: wikiSearchQuery.data || [],
    isSearchLoading: wikiSearchQuery.isLoading,
    searchError: wikiSearchQuery.error,
    
    // Selected data
    selectedWikis,
    selectedResults,
    
    // Actions
    setSelectedWikis,
    setSelectedResults,
    refetchSearch: wikiSearchQuery.refetch,
  }
}

export interface WikiContentFilter {
  spoilerLevel: 'none' | 'minimal' | 'moderate' | 'full'
  contentTypes: ('characters' | 'locations' | 'events' | 'magic' | 'culture')[]
  currentChapter?: number
  readingProgress?: number // 0-100%
}

export function useFilteredWikiContent(
  wikiResults: { wiki: WikiIntegration; results: WikiSearchResult[] }[],
  filter: WikiContentFilter
) {
  const [filteredContent, setFilteredContent] = useState<WikiSearchResult[]>([])

  useEffect(() => {
    const filtered = wikiResults.flatMap(({ results }) => 
      results.filter(result => {
        // Basic spoiler filtering based on title keywords
        const title = result.title.toLowerCase()
        const snippet = result.snippet.toLowerCase()
        
        // Filter by content type
        const hasRelevantContent = filter.contentTypes.some(type => {
          switch (type) {
            case 'characters':
              return title.includes('character') || 
                     snippet.includes('character') ||
                     /\b(lord|lady|king|queen|prince|princess|ser|knight)\b/.test(snippet)
            case 'locations':
              return title.includes('location') || 
                     snippet.includes('city') || 
                     snippet.includes('kingdom') ||
                     /\b(castle|city|town|village|realm|kingdom)\b/.test(snippet)
            case 'events':
              return title.includes('battle') || 
                     title.includes('war') || 
                     snippet.includes('event')
            case 'magic':
              return snippet.includes('magic') || 
                     snippet.includes('power') ||
                     /\b(spell|enchant|magic|sorcery|wizard|mage)\b/.test(snippet)
            case 'culture':
              return snippet.includes('culture') || 
                     snippet.includes('tradition') ||
                     snippet.includes('religion')
            default:
              return true
          }
        })

        // Basic spoiler detection (this would be more sophisticated in production)
        const hasSpoilerKeywords = /\b(death|dies|killed|ending|finale|conclusion|spoiler)\b/i.test(snippet)
        
        if (filter.spoilerLevel === 'none' && hasSpoilerKeywords) {
          return false
        }

        return hasRelevantContent
      })
    )

    setFilteredContent(filtered)
  }, [wikiResults, filter])

  return filteredContent
}
