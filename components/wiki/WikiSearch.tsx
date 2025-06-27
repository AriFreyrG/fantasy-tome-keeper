'use client'

import { useState } from 'react'
import { Search, Book, Globe, Filter, ChevronDown, Sparkles } from 'lucide-react'
import { useBookWikiData, useFilteredWikiContent, WikiContentFilter } from '@/hooks/use-wiki-integration'
import { WikiIntegration, WikiSearchResult } from '@/lib/wiki-integration'

interface WikiSearchProps {
  readonly bookTitle?: string
  readonly author?: string
  readonly className?: string
}

export function WikiSearch({ bookTitle, author, className = '' }: WikiSearchProps) {
  const [searchTitle, setSearchTitle] = useState(bookTitle ?? '')
  const [searchAuthor, setSearchAuthor] = useState(author ?? '')
  const [showFilters, setShowFilters] = useState(false)
  const [filter, setFilter] = useState<WikiContentFilter>({
    spoilerLevel: 'minimal',
    contentTypes: ['characters', 'locations'],
    currentChapter: undefined,
    readingProgress: undefined
  })

  const {
    wikiSearchResults,
    isSearchLoading,
    searchError,
    selectedWikis,
    setSelectedWikis,
    refetchSearch
  } = useBookWikiData(searchTitle, searchAuthor)

  const filteredContent = useFilteredWikiContent(wikiSearchResults, filter)

  const handleSearch = () => {
    refetchSearch()
  }

  const toggleWikiSelection = (wiki: WikiIntegration) => {
    setSelectedWikis(prev => 
      prev.find(w => w.id === wiki.id)
        ? prev.filter(w => w.id !== wiki.id)
        : [...prev, wiki]
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Form */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Fantasy Wiki Search</h3>
          <Sparkles className="h-4 w-4 text-fantasy-gold" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="book-title" className="block text-sm font-medium text-gray-700 mb-2">
              Book Title
            </label>
            <input
              id="book-title"
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Enter book or series title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              id="author"
              type="text"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              placeholder="Enter author name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSearch}
            disabled={isSearchLoading || !searchTitle || !searchAuthor}
            className="btn-fantasy flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearchLoading ? 'Searching...' : 'Search Wikis'}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label htmlFor="spoiler-level" className="block text-sm font-medium text-gray-700 mb-2">
                Spoiler Level
              </label>
              <select
                id="spoiler-level"
                value={filter.spoilerLevel}
                onChange={(e) => setFilter(prev => ({ ...prev, spoilerLevel: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="none">No spoilers</option>
                <option value="minimal">Minimal spoilers</option>
                <option value="moderate">Moderate spoilers</option>
                <option value="full">All content</option>
              </select>
            </div>

            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Content Types
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['characters', 'locations', 'events', 'magic', 'culture'] as const).map(type => {
                    const isChecked = filter.contentTypes.includes(type)
                    
                    const handleContentTypeChange = (checked: boolean) => {
                      const newContentTypes = checked
                        ? [...filter.contentTypes, type]
                        : filter.contentTypes.filter(t => t !== type)
                      
                      setFilter(prev => ({
                        ...prev,
                        contentTypes: newContentTypes
                      }))
                    }

                    return (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleContentTypeChange(e.target.checked)}
                          className="text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{type}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {searchError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error searching wikis: {searchError.message}
          </p>
        </div>
      )}

      {/* Wiki Selection */}
      {wikiSearchResults.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Wikis</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {wikiSearchResults.map(({ wiki, results }) => {
              const isSelected = selectedWikis.find(w => w.id === wiki.id)
              
              return (
                <button
                  key={wiki.id}
                  type="button"
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleWikiSelection(wiki)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{wiki.name}</h5>
                    <span className="text-xs text-gray-500 capitalize">{wiki.quality}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {results.length} relevant {results.length === 1 ? 'page' : 'pages'}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Globe className="h-3 w-3 mr-1" />
                    {wiki.license}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Search Results */}
      {filteredContent.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Wiki Content ({filteredContent.length} results)
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredContent.map((result) => (
              <WikiResultCard key={`${result.title}-${result.timestamp}`} result={result} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isSearchLoading && searchTitle && searchAuthor && wikiSearchResults.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Wiki Content Found</h3>
          <p className="text-gray-600">
            No fantasy wikis found for "{searchTitle}" by {searchAuthor}. 
            Try different search terms or check the spelling.
          </p>
        </div>
      )}
    </div>
  )
}

interface WikiResultCardProps {
  readonly result: WikiSearchResult
}

function WikiResultCard({ result }: WikiResultCardProps) {
  return (
    <div className="book-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h5 className="font-medium text-gray-900 line-clamp-1">{result.title}</h5>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          View →
        </a>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
        {result.snippet}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{result.wordcount} words</span>
        <span>{new Date(result.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
