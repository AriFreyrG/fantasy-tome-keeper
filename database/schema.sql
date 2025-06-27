-- Fantasy Tome Keeper Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON tables TO postgres, anon, authenticated, service_role;

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  reading_goal INTEGER DEFAULT 0,
  theme_preference TEXT DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  default_view TEXT DEFAULT 'grid' CHECK (default_view IN ('grid', 'list', 'shelf')),
  show_spoilers BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User books table
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  series TEXT,
  series_order INTEGER,
  isbn TEXT,
  description TEXT,
  cover_url TEXT,
  page_count INTEGER,
  published_date DATE,
  genres TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'want-to-read' CHECK (status IN ('want-to-read', 'reading', 'completed', 'dnf')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  current_page INTEGER DEFAULT 0,
  date_added TIMESTAMPTZ DEFAULT NOW(),
  date_started TIMESTAMPTZ,
  date_completed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book notes table
CREATE TABLE book_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES user_books(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  chapter TEXT,
  page_number INTEGER,
  audio_timestamp INTEGER, -- seconds
  tags TEXT[] DEFAULT '{}',
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'character', 'world-building', 'plot', 'quote')),
  spoiler_level TEXT DEFAULT 'none' CHECK (spoiler_level IN ('none', 'minor', 'major')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character notes table
CREATE TABLE character_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES user_books(id) ON DELETE CASCADE NOT NULL,
  character_name TEXT NOT NULL,
  description TEXT,
  role TEXT CHECK (role IN ('protagonist', 'antagonist', 'supporting', 'minor')),
  first_appearance TEXT,
  relationships TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading sessions table
CREATE TABLE reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES user_books(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  pages_read INTEGER NOT NULL DEFAULT 0,
  start_page INTEGER NOT NULL DEFAULT 0,
  end_page INTEGER NOT NULL DEFAULT 0,
  audio_time_listened INTEGER DEFAULT 0, -- seconds
  session_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audiobooks table
CREATE TABLE audiobooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES user_books(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  narrator TEXT,
  duration INTEGER, -- seconds
  audio_source_type TEXT NOT NULL CHECK (audio_source_type IN ('local', 'url', 'youtube', 'cloud')),
  audio_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  cloud_provider TEXT CHECK (cloud_provider IN ('google-drive', 'dropbox', 'onedrive')),
  current_position INTEGER DEFAULT 0, -- seconds
  playback_rate REAL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading lists for sharing
CREATE TABLE reading_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books in reading lists
CREATE TABLE reading_list_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES reading_lists(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES user_books(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(list_id, book_id)
);

-- Book reviews for sharing
CREATE TABLE book_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES user_books(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  spoiler_level TEXT DEFAULT 'none' CHECK (spoiler_level IN ('none', 'minor', 'major')),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- User follows for social features
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Reading activity feed
CREATE TABLE reading_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('started_book', 'finished_book', 'added_review', 'created_list')),
  book_id UUID REFERENCES user_books(id) ON DELETE CASCADE,
  list_id UUID REFERENCES reading_lists(id) ON DELETE CASCADE,
  review_id UUID REFERENCES book_reviews(id) ON DELETE CASCADE,
  activity_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_books_user_id ON user_books(user_id);
CREATE INDEX idx_user_books_status ON user_books(status);
CREATE INDEX idx_book_notes_user_id ON book_notes(user_id);
CREATE INDEX idx_book_notes_book_id ON book_notes(book_id);
CREATE INDEX idx_character_notes_user_id ON character_notes(user_id);
CREATE INDEX idx_character_notes_book_id ON character_notes(book_id);
CREATE INDEX idx_reading_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX idx_audiobooks_user_id ON audiobooks(user_id);
CREATE INDEX idx_reading_lists_user_id ON reading_lists(user_id);
CREATE INDEX idx_reading_lists_public ON reading_lists(is_public) WHERE is_public = true;
CREATE INDEX idx_book_reviews_user_id ON book_reviews(user_id);
CREATE INDEX idx_book_reviews_public ON book_reviews(is_public) WHERE is_public = true;
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_reading_activity_user_id ON reading_activity(user_id);

-- Row Level Security Policies

-- User profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User books
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own books" ON user_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own books" ON user_books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own books" ON user_books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own books" ON user_books FOR DELETE USING (auth.uid() = user_id);

-- Book notes
ALTER TABLE book_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notes" ON book_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON book_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON book_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON book_notes FOR DELETE USING (auth.uid() = user_id);

-- Character notes
ALTER TABLE character_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own character notes" ON character_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own character notes" ON character_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own character notes" ON character_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own character notes" ON character_notes FOR DELETE USING (auth.uid() = user_id);

-- Reading sessions
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sessions" ON reading_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON reading_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON reading_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON reading_sessions FOR DELETE USING (auth.uid() = user_id);

-- Audiobooks
ALTER TABLE audiobooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own audiobooks" ON audiobooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own audiobooks" ON audiobooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own audiobooks" ON audiobooks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own audiobooks" ON audiobooks FOR DELETE USING (auth.uid() = user_id);

-- Reading lists
ALTER TABLE reading_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own lists" ON reading_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public lists" ON reading_lists FOR SELECT USING (is_public = true);
CREATE POLICY "Users can insert their own lists" ON reading_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lists" ON reading_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lists" ON reading_lists FOR DELETE USING (auth.uid() = user_id);

-- Reading list books
ALTER TABLE reading_list_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view books in their lists" ON reading_list_books FOR SELECT USING (
  EXISTS (SELECT 1 FROM reading_lists WHERE id = list_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view books in public lists" ON reading_list_books FOR SELECT USING (
  EXISTS (SELECT 1 FROM reading_lists WHERE id = list_id AND is_public = true)
);
CREATE POLICY "Users can insert books in their lists" ON reading_list_books FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM reading_lists WHERE id = list_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update books in their lists" ON reading_list_books FOR UPDATE USING (
  EXISTS (SELECT 1 FROM reading_lists WHERE id = list_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete books from their lists" ON reading_list_books FOR DELETE USING (
  EXISTS (SELECT 1 FROM reading_lists WHERE id = list_id AND user_id = auth.uid())
);

-- Book reviews
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own reviews" ON book_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public reviews" ON book_reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Users can insert their own reviews" ON book_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON book_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON book_reviews FOR DELETE USING (auth.uid() = user_id);

-- User follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their follows" ON user_follows FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);
CREATE POLICY "Users can insert their own follows" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Reading activity
ALTER TABLE reading_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own activity" ON reading_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view activity of followed users" ON reading_activity FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_follows WHERE following_id = user_id AND follower_id = auth.uid())
);
CREATE POLICY "Users can insert their own activity" ON reading_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_books_updated_at BEFORE UPDATE ON user_books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_book_notes_updated_at BEFORE UPDATE ON book_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_character_notes_updated_at BEFORE UPDATE ON character_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audiobooks_updated_at BEFORE UPDATE ON audiobooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reading_lists_updated_at BEFORE UPDATE ON reading_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_book_reviews_updated_at BEFORE UPDATE ON book_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', new.email));
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
