// MediaWiki API client for fantasy wikis
export interface WikiSearchResult {
  title: string
  snippet: string
  size: number
  wordcount: number
  timestamp: string
  url: string
}

export interface WikiPage {
  title: string
  extract: string
  fullUrl: string
  categories: string[]
  images: string[]
  lastModified: string
}

export interface WikiIntegration {
  id: string
  name: string
  baseUrl: string
  apiEndpoint: string
  license: 'CC-BY-SA' | 'CC-BY' | 'Fair-Use'
  authorKeywords: string[]
  seriesKeywords: string[]
  categories: string[]
  quality: 'exceptional' | 'excellent' | 'very-good' | 'good'
}

export const FANTASY_WIKIS: WikiIntegration[] = [
  {
    id: 'coppermind',
    name: 'The Coppermind',
    baseUrl: 'https://coppermind.net',
    apiEndpoint: '/w/api.php',
    license: 'CC-BY-SA',
    authorKeywords: ['brandon sanderson', 'sanderson'],
    seriesKeywords: ['stormlight', 'mistborn', 'elantris', 'warbreaker', 'cosmere'],
    categories: ['Characters', 'Books', 'Magic', 'Locations', 'Events'],
    quality: 'exceptional'
  },
  {
    id: 'awoiaf',
    name: 'A Wiki of Ice and Fire',
    baseUrl: 'https://awoiaf.westeros.org',
    apiEndpoint: '/index.php/api.php',
    license: 'CC-BY-SA',
    authorKeywords: ['george r.r. martin', 'george martin', 'grrm'],
    seriesKeywords: ['game of thrones', 'song of ice and fire', 'asoiaf', 'fire and blood'],
    categories: ['Characters', 'Houses', 'Locations', 'Events', 'Culture'],
    quality: 'excellent'
  },
  {
    id: 'tolkien-gateway',
    name: 'Tolkien Gateway',
    baseUrl: 'https://tolkiengateway.net',
    apiEndpoint: '/w/api.php',
    license: 'CC-BY-SA',
    authorKeywords: ['j.r.r. tolkien', 'tolkien'],
    seriesKeywords: ['lord of the rings', 'hobbit', 'silmarillion', 'middle-earth'],
    categories: ['Characters', 'Locations', 'Events', 'Languages', 'Peoples'],
    quality: 'excellent'
  },
  {
    id: 'wot-wiki',
    name: 'Wheel of Time Wiki',
    baseUrl: 'https://wot.fandom.com',
    apiEndpoint: '/api.php',
    license: 'CC-BY-SA',
    authorKeywords: ['robert jordan', 'brandon sanderson'],
    seriesKeywords: ['wheel of time', 'wot'],
    categories: ['Characters', 'Nations', 'Organizations', 'Magic', 'Locations'],
    quality: 'very-good'
  },
  {
    id: 'witcher-wiki',
    name: 'Witcher Wiki',
    baseUrl: 'https://witcher.fandom.com',
    apiEndpoint: '/api.php',
    license: 'CC-BY-SA',
    authorKeywords: ['andrzej sapkowski'],
    seriesKeywords: ['witcher', 'geralt'],
    categories: ['Characters', 'Locations', 'Monsters', 'Magic', 'Quests'],
    quality: 'very-good'
  }
]

export class MediaWikiClient {
  private baseUrl: string
  private apiEndpoint: string
  private requestDelay = 1000 // 1 second between requests to be respectful

  constructor(wiki: WikiIntegration) {
    this.baseUrl = wiki.baseUrl
    this.apiEndpoint = wiki.apiEndpoint
  }

  private async makeRequest(params: URLSearchParams): Promise<any> {
    // Add CORS handling and format
    params.set('format', 'json')
    params.set('origin', '*') // Enable CORS for browser requests
    
    const url = `${this.baseUrl}${this.apiEndpoint}?${params.toString()}`
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`MediaWiki API error for ${this.baseUrl}:`, error)
      throw error
    }
  }

  async search(query: string, limit: number = 10): Promise<WikiSearchResult[]> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: limit.toString(),
      srprop: 'title|snippet|size|wordcount|timestamp'
    })

    const data = await this.makeRequest(params)
    
    if (!data.query?.search) {
      return []
    }

    return data.query.search.map((result: any) => ({
      title: result.title,
      snippet: this.cleanSnippet(result.snippet || ''),
      size: result.size || 0,
      wordcount: result.wordcount || 0,
      timestamp: result.timestamp,
      url: `${this.baseUrl}/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`
    }))
  }

  async getPage(title: string): Promise<WikiPage | null> {
    const params = new URLSearchParams({
      action: 'query',
      prop: 'extracts|info|categories|images',
      titles: title,
      exintro: 'true',
      explaintext: 'true',
      exsectionformat: 'plain',
      inprop: 'url',
      cllimit: '50',
      imlimit: '10'
    })

    const data = await this.makeRequest(params)
    
    if (!data.query?.pages) {
      return null
    }

    const pages = Object.values(data.query.pages) as any[]
    const page = pages[0]

    if (!page || page.missing) {
      return null
    }

    return {
      title: page.title,
      extract: page.extract || '',
      fullUrl: page.fullurl || `${this.baseUrl}/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
      categories: (page.categories || []).map((cat: any) => cat.title.replace('Category:', '')),
      images: (page.images || []).map((img: any) => img.title),
      lastModified: page.touched || ''
    }
  }

  async searchCategories(category: string, limit: number = 20): Promise<string[]> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${category}`,
      cmlimit: limit.toString(),
      cmtype: 'page'
    })

    const data = await this.makeRequest(params)
    
    if (!data.query?.categorymembers) {
      return []
    }

    return data.query.categorymembers.map((member: any) => member.title)
  }

  private cleanSnippet(snippet: string): string {
    // Remove HTML tags and clean up MediaWiki markup
    return snippet
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\[\[([^\]]+)\]\]/g, '$1') // Remove wiki links
      .trim()
  }
}

export class WikiIntegrationService {
  private clients: Map<string, MediaWikiClient> = new Map()

  constructor() {
    // Initialize clients for all wikis
    FANTASY_WIKIS.forEach(wiki => {
      this.clients.set(wiki.id, new MediaWikiClient(wiki))
    })
  }

  findRelevantWikis(bookTitle: string, author: string): WikiIntegration[] {
    const query = `${bookTitle} ${author}`.toLowerCase()
    
    return FANTASY_WIKIS.filter(wiki => {
      // Check if author matches
      const authorMatch = wiki.authorKeywords.some(keyword => 
        author.toLowerCase().includes(keyword)
      )
      
      // Check if book/series matches
      const seriesMatch = wiki.seriesKeywords.some(keyword =>
        query.includes(keyword)
      )
      
      return authorMatch || seriesMatch
    }).sort((a, b) => {
      // Sort by quality
      const qualityOrder = { exceptional: 4, excellent: 3, 'very-good': 2, good: 1 }
      return qualityOrder[b.quality] - qualityOrder[a.quality]
    })
  }

  async searchForBook(bookTitle: string, author: string): Promise<{
    wiki: WikiIntegration
    results: WikiSearchResult[]
  }[]> {
    const relevantWikis = this.findRelevantWikis(bookTitle, author)
    const searchResults: { wiki: WikiIntegration; results: WikiSearchResult[] }[] = []

    for (const wiki of relevantWikis) {
      try {
        const client = this.clients.get(wiki.id)!
        
        // Search for the book title
        const bookResults = await client.search(bookTitle, 5)
        
        // Search for the author
        const authorResults = await client.search(author, 3)
        
        // Combine and deduplicate results
        const combinedResults = [...bookResults, ...authorResults]
        const uniqueResults = this.deduplicateResults(combinedResults)
        
        if (uniqueResults.length > 0) {
          searchResults.push({
            wiki,
            results: uniqueResults.slice(0, 8) // Limit to top 8 results per wiki
          })
        }

        // Be respectful - wait between API calls
        await this.delay(1000)
      } catch (error) {
        console.error(`Error searching ${wiki.name}:`, error)
        // Continue with other wikis even if one fails
      }
    }

    return searchResults
  }

  async getCharacterInfo(characterName: string, wikis: WikiIntegration[]): Promise<{
    wiki: WikiIntegration
    page: WikiPage | null
  }[]> {
    const results: { wiki: WikiIntegration; page: WikiPage | null }[] = []

    for (const wiki of wikis) {
      try {
        const client = this.clients.get(wiki.id)!
        const page = await client.getPage(characterName)
        
        results.push({ wiki, page })
        
        // Be respectful - wait between API calls
        await this.delay(1000)
      } catch (error) {
        console.error(`Error getting character info from ${wiki.name}:`, error)
        results.push({ wiki, page: null })
      }
    }

    return results
  }

  private deduplicateResults(results: WikiSearchResult[]): WikiSearchResult[] {
    const seen = new Set<string>()
    return results.filter(result => {
      if (seen.has(result.title)) {
        return false
      }
      seen.add(result.title)
      return true
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const wikiService = new WikiIntegrationService()
