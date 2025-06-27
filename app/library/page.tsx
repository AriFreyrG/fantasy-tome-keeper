'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Grid, 
  List, 
  LogOut,
  User,
  Settings,
  TrendingUp,
  Heart
} from 'lucide-react'
import Link from 'next/link'

export default function LibraryPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<'all' | 'reading' | 'completed' | 'want-to-read'>('all')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-fantasy-gold/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="h-16 w-16 text-primary-600 animate-pulse mx-auto" />
          <p className="text-gray-600">Loading your magical library...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getDisplayName = () => {
    if (profile?.display_name) {
      return profile.display_name
    }
    return user.email?.split('@')[0] ?? 'User'
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-fantasy-gold/10">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
              <BookOpen className="h-8 w-8" />
              <span className="text-xl font-fantasy font-semibold">Fantasy Tome Keeper</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {getInitials()}
                </div>
                <span className="text-gray-700 font-medium">Welcome, {getDisplayName()}</span>
              </div>

              {/* Navigation */}
              <nav className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Currently Reading</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reading Goal</p>
                <p className="text-3xl font-bold text-gray-900">{profile?.reading_goal ?? 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-fantasy-gold" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-8">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">All Books</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Completed</option>
              <option value="want-to-read">Want to Read</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Add Book Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Books Grid/List */}
        <div className="glass rounded-lg p-8">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your library is empty</h3>
            <p className="text-gray-600 mb-6">Start building your fantasy collection by adding your first book.</p>
            <button className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Plus className="h-5 w-5" />
              <span>Add Your First Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
