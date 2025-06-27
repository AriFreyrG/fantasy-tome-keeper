'use client'

import { BookOpen, Music, Plus, User, Globe, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { WikiContentDisplay } from '@/components/wiki'

export default function HomePage() {
  const { user, profile, loading } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-fantasy font-semibold text-gray-900">
                Fantasy Tome Keeper
              </h1>
            </div>
            <nav className="flex items-center space-x-6">
              {!loading && user ? (
                // Authenticated user navigation
                <>
                  <Link 
                    href="/library" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Library
                  </Link>
                  <Link 
                    href="/audiobooks" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Audiobooks
                  </Link>
                  <Link 
                    href="/notes" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Notes
                  </Link>
                  <Link 
                    href="/library"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{profile?.display_name ?? user.email?.split('@')[0] ?? 'Library'}</span>
                  </Link>
                </>
              ) : (
                // Guest navigation
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link 
                    href="/signup"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-fantasy font-bold text-gray-900 mb-4">
            Your Personal Fantasy Library
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Organize your fantasy book collection, take detailed notes, and enjoy integrated audiobook playback. 
            All in one beautiful, offline-capable app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-fantasy">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Book
            </button>
            <Link 
              href="/demo"
              className="bg-purple-600 border-2 border-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all duration-200"
            >
              Try Wiki Demo
            </Link>
            <Link 
              href="/library"
              className="bg-white border-2 border-primary-500 text-primary-600 font-semibold py-2 px-6 rounded-lg hover:bg-primary-50 transition-all duration-200"
            >
              Browse Library
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="book-card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Book Management</h3>
            <p className="text-gray-600">
              Add books by ISBN, title, or photo. Automatically fetch cover art, descriptions, and series information.
            </p>
          </div>

          <div className="book-card p-6">
            <div className="w-12 h-12 bg-fantasy-gold/20 rounded-lg flex items-center justify-center mb-4">
              <Music className="h-6 w-6 text-fantasy-darkgold" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrated Audiobooks</h3>
            <p className="text-gray-600">
              Play local audio files, stream from URLs, or link cloud storage. Advanced playback with bookmarking.
            </p>
          </div>

          <div className="book-card p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Notes</h3>
            <p className="text-gray-600">
              Take chapter-by-chapter notes, track characters, and document world-building details with rich formatting.
            </p>
          </div>

          <div className="book-card p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fantasy Wiki Integration</h3>
            <p className="text-gray-600">
              Access rich world-building content from community wikis like Coppermind, AWOIAF, and Tolkien Gateway.
            </p>
          </div>
        </div>

        {/* Wiki Integration Demo */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-fantasy font-bold text-gray-900 mb-4">
              Explore Fantasy Worlds
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Demo our fantasy wiki integration with popular series. Search for characters, locations, 
              and world-building details with spoiler protection.
            </p>
          </div>
          
          <WikiContentDisplay 
            bookTitle="The Way of Kings"
            author="Brandon Sanderson"
            currentChapter={5}
            readingProgress={15}
          />
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-fantasy font-semibold text-gray-900 mb-6">
            Start Building Your Fantasy Library
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
              <div className="text-gray-600">Books Added</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-fantasy-gold mb-2">0</div>
              <div className="text-gray-600">Hours Listened</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">0</div>
              <div className="text-gray-600">Notes Written</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
