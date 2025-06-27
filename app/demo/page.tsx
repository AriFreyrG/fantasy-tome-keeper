import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { WikiContentDisplay } from '@/components/wiki'

export default function WikiDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-fantasy-gold/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <h1 className="text-xl font-fantasy font-semibold text-gray-900">
                Wiki Integration Demo
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fantasy font-bold text-gray-900 mb-4">
            Fantasy Wiki Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            Experience how Fantasy Tome Keeper seamlessly integrates with community-maintained fantasy wikis
            to provide rich world-building context, character information, and spoiler-safe exploration tools.
          </p>
          <div className="glass rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Try These Examples:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-medium text-primary-600 mb-1">The Stormlight Archive</h4>
                <p className="text-sm text-gray-600">Brandon Sanderson</p>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-primary-600 mb-1">A Song of Ice and Fire</h4>
                <p className="text-sm text-gray-600">George R.R. Martin</p>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-primary-600 mb-1">The Lord of the Rings</h4>
                <p className="text-sm text-gray-600">J.R.R. Tolkien</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <WikiContentDisplay 
          bookTitle="The Way of Kings"
          author="Brandon Sanderson"
          currentChapter={10}
          readingProgress={25}
          className="mb-8"
        />

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Spoiler Protection</h3>
            <p className="text-gray-600 mb-4">
              Content is filtered based on your reading progress to avoid unwanted spoilers.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Keyword-based spoiler detection</li>
              <li>• Chapter-aware content filtering</li>
              <li>• Manual spoiler controls</li>
            </ul>
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Rich Content Sources</h3>
            <p className="text-gray-600 mb-4">
              Access information from the highest quality fantasy wikis available.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• The Coppermind (Sanderson)</li>
              <li>• A Wiki of Ice and Fire</li>
              <li>• Tolkien Gateway</li>
              <li>• Wheel of Time Wiki</li>
            </ul>
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Integration</h3>
            <p className="text-gray-600 mb-4">
              Automatically matches books to relevant wikis and content.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Author-based wiki selection</li>
              <li>• Series keyword matching</li>
              <li>• Quality-ranked results</li>
              <li>• Real-time search</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-fantasy font-bold text-gray-900 mb-4">
              Ready to Enhance Your Reading Experience?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of fantasy readers who use Fantasy Tome Keeper to deepen their
              understanding and enjoyment of their favorite worlds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="btn-fantasy"
              >
                Get Started Now
              </Link>
              <Link 
                href="/library"
                className="bg-white border-2 border-primary-500 text-primary-600 font-semibold py-2 px-6 rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
