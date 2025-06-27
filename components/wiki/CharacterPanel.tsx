'use client'

import { useState, useEffect } from 'react'
import { User, MapPin, Book, Eye, EyeOff, ExternalLink, AlertTriangle } from 'lucide-react'
import { useWikiPage } from '@/hooks/use-wiki-integration'
import { WikiIntegration } from '@/lib/wiki-integration'

interface CharacterPanelProps {
  readonly characterName: string
  readonly selectedWikis: WikiIntegration[]
  readonly spoilerLevel: 'none' | 'minimal' | 'moderate' | 'full'
  readonly currentChapter?: number
  readonly className?: string
}

export function CharacterPanel({ 
  characterName, 
  selectedWikis, 
  spoilerLevel,
  currentChapter,
  className = '' 
}: CharacterPanelProps) {
  const [showSpoilers, setShowSpoilers] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']))

  const { data: characterResults, isLoading, error } = useWikiPage(characterName, selectedWikis)

  // Get the first available character data
  const characterData = characterResults?.find(result => result.page !== null)?.page

  useEffect(() => {
    setShowSpoilers(spoilerLevel === 'full')
  }, [spoilerLevel])

  if (isLoading) {
    return (
      <div className={`glass rounded-xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (error || !characterData) {
    return (
      <div className={`glass rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Character Not Found</h3>
          <p className="text-gray-600">
            No information found for "{characterName}" in the selected wikis.
          </p>
          {characterResults && characterResults.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Searched in: {characterResults.map(r => r.wiki.name).join(', ')}
            </div>
          )}
        </div>
      </div>
    )
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const filterContentBySpoilerLevel = (content: string): string => {
    if (spoilerLevel === 'full' || showSpoilers) {
      return content
    }

    // Basic spoiler filtering - in production this would be more sophisticated
    const spoilerKeywords = [
      'death', 'dies', 'killed', 'murder', 'betrayal', 'ending', 'finale',
      'revelation', 'secret', 'twist', 'becomes', 'transforms'
    ]

    let filtered = content
    spoilerKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      filtered = filtered.replace(regex, '[SPOILER]')
    })

    return filtered
  }

  const hasPotentialSpoilers = (content: string): boolean => {
    const spoilerKeywords = ['death', 'dies', 'killed', 'ending', 'finale', 'revelation']
    return spoilerKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    )
  }

  return (
    <div className={`glass rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6" />
            <h3 className="text-xl font-semibold">{characterData.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {hasPotentialSpoilers(characterData.extract) && (
              <button
                type="button"
                onClick={() => setShowSpoilers(!showSpoilers)}
                className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
              >
                {showSpoilers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="text-sm">
                  {showSpoilers ? 'Hide' : 'Show'} Spoilers
                </span>
              </button>
            )}
            <a
              href={characterData.fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Spoiler Warning */}
        {hasPotentialSpoilers(characterData.extract) && !showSpoilers && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Spoiler Warning</span>
            </div>
            <p className="text-amber-700 mt-1">
              Some content may contain spoilers. Use the spoiler toggle to reveal all content.
            </p>
          </div>
        )}

        {/* Basic Information */}
        <section>
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
            <div className={`transform transition-transform ${
              expandedSections.has('basic') ? 'rotate-180' : ''
            }`}>
              ↓
            </div>
          </button>
          
          {expandedSections.has('basic') && (
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>{filterContentBySpoilerLevel(characterData.extract)}</p>
            </div>
          )}
        </section>

        {/* Categories/Tags */}
        {characterData.categories && characterData.categories.length > 0 && (
          <section>
            <button
              type="button"
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h4 className="text-lg font-semibold text-gray-900">Categories</h4>
              <div className={`transform transition-transform ${
                expandedSections.has('categories') ? 'rotate-180' : ''
              }`}>
                ↓
              </div>
            </button>
            
            {expandedSections.has('categories') && (
              <div className="flex flex-wrap gap-2">
                {characterData.categories.map((category: string) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {category.replace('Category:', '')}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Quick Actions */}
        <section className="border-t pt-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Book className="h-4 w-4" />
              <span>Add to Notes</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>View Relations</span>
            </button>
          </div>
        </section>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 border-t pt-3">
          Last updated: {new Date(characterData.lastModified).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
