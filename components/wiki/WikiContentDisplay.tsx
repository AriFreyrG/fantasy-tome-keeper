'use client'

import { useState } from 'react'
import { Book, Users, MapPin, Sparkles, Globe, ArrowRight } from 'lucide-react'
import { WikiSearch } from './WikiSearch'
import { CharacterPanel } from './CharacterPanel'
import { useBookWikiData } from '@/hooks/use-wiki-integration'

interface WikiContentDisplayProps {
  readonly bookTitle?: string
  readonly author?: string
  readonly currentChapter?: number
  readonly readingProgress?: number
  readonly className?: string
}

type ActiveTab = 'search' | 'characters' | 'locations' | 'magic' | 'overview'

export function WikiContentDisplay({ 
  bookTitle, 
  author, 
  currentChapter,
  readingProgress,
  className = '' 
}: WikiContentDisplayProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search')
  const [selectedCharacter, setSelectedCharacter] = useState<string>('')
  
  const {
    wikiSearchResults,
    selectedWikis,
    isSearchLoading
  } = useBookWikiData(bookTitle, author)

  const tabs = [
    { id: 'search' as const, label: 'Wiki Search', icon: Globe },
    { id: 'characters' as const, label: 'Characters', icon: Users },
    { id: 'locations' as const, label: 'Locations', icon: MapPin },
    { id: 'magic' as const, label: 'Magic Systems', icon: Sparkles },
    { id: 'overview' as const, label: 'Overview', icon: Book },
  ]

  const getCharacterSuggestions = () => {
    // Extract character names from search results
    const characterKeywords = ['character', 'protagonist', 'lord', 'lady', 'king', 'queen', 'prince', 'princess']
    
    const suggestions: string[] = []
    
    for (const { results } of wikiSearchResults) {
      for (const result of results) {
        const hasCharacterKeyword = characterKeywords.some(keyword => 
          result.title.toLowerCase().includes(keyword) ||
          result.snippet.toLowerCase().includes(keyword)
        )
        
        if (hasCharacterKeyword) {
          suggestions.push(result.title)
        }
        
        if (suggestions.length >= 5) break
      }
      if (suggestions.length >= 5) break
    }
    
    return suggestions.slice(0, 5)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <WikiSearch 
            bookTitle={bookTitle}
            author={author}
            className="mt-6"
          />
        )

      case 'characters': {
        const characterSuggestions = getCharacterSuggestions()
        
        return (
          <div className="mt-6 space-y-6">
            {/* Character Selection */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Character Lookup</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  placeholder="Enter character name..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {/* Search character */}}
                  disabled={!selectedCharacter || selectedWikis.length === 0}
                  className="btn-fantasy whitespace-nowrap"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Look Up Character
                </button>
              </div>

              {/* Character Suggestions */}
              {characterSuggestions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Characters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {characterSuggestions.map((character) => (
                      <button
                        key={character}
                        type="button"
                        onClick={() => setSelectedCharacter(character)}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm hover:bg-primary-200 transition-colors"
                      >
                        {character}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Character Panel */}
            {selectedCharacter && selectedWikis.length > 0 && (
              <CharacterPanel
                characterName={selectedCharacter}
                selectedWikis={selectedWikis}
                spoilerLevel="minimal"
                currentChapter={currentChapter}
              />
            )}
          </div>
        )
      }

      case 'locations':
        return (
          <div className="mt-6">
            <div className="glass rounded-xl p-6 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Location Explorer</h3>
              <p className="text-gray-600 mb-4">
                Explore the worlds and locations from your favorite fantasy series.
              </p>
              <div className="text-sm text-gray-500">
                Location panel coming soon! This will show maps, descriptions, and key events for fantasy locations.
              </div>
            </div>
          </div>
        )

      case 'magic':
        return (
          <div className="mt-6">
            <div className="glass rounded-xl p-6 text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Magic Systems</h3>
              <p className="text-gray-600 mb-4">
                Understand the rules and mechanics of magic in your favorite fantasy worlds.
              </p>
              <div className="text-sm text-gray-500">
                Magic system guides coming soon! This will explain how magic works in different fantasy universes.
              </div>
            </div>
          </div>
        )

      case 'overview':
        return (
          <div className="mt-6 space-y-6">
            {/* Wiki Summary */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wiki Integration Overview</h3>
              
              {wikiSearchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600 mb-1">
                        {wikiSearchResults.length}
                      </div>
                      <div className="text-sm text-gray-600">Wikis Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {wikiSearchResults.reduce((sum, r) => sum + r.results.length, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Pages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fantasy-gold mb-1">
                        {selectedWikis.length}
                      </div>
                      <div className="text-sm text-gray-600">Active Sources</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Available Content:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('characters')}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary-600" />
                          <span className="font-medium">Characters</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('locations')}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-primary-600" />
                          <span className="font-medium">Locations</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No wiki data available. Use the search tab to find content for your book.
                  </p>
                </div>
              )}
            </div>

            {/* Reading Progress Integration */}
            {currentChapter && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Progress</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Current Chapter:</span>
                  <span className="font-medium">{currentChapter}</span>
                </div>
                {readingProgress && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">{readingProgress}%</span>
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Wiki content is filtered based on your reading progress to avoid spoilers.
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-fantasy font-bold text-gray-900 mb-2">
          Fantasy Wiki Integration
        </h2>
        <p className="text-gray-600">
          Explore rich world-building content from community-maintained fantasy wikis
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="glass rounded-xl p-1">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Loading State */}
      {isSearchLoading && activeTab === 'search' && (
        <div className="glass rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching fantasy wikis...</p>
        </div>
      )}

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}
