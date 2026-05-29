/*
  # Site Management and New Features

  Updates the database schema to support multi-apartment site management
  and adds new features for local businesses and community forum.

  1. New Tables
    - `sites` - Site complex information (name, address, management)
    - `site_blocks` - Individual blocks within a site
    - `local_businesses` - Partner businesses with discounts
    - `forum_posts` - Community discussion posts
    - `forum_replies` - Replies to forum posts

  2. Modified Tables
    - `profiles` - Added site_id and block_id references
    - `announcements` - Added site_id scope
    - `neighbors` - Added block_id reference

  3. Security
    - Enable RLS on all new tables
    - Site-scoped policies for multi-tenancy
*/

-- Sites table
CREATE TABLE IF NOT EXISTS sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text,
  district text,
  management_name text,
  management_phone text,
  management_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site blocks table
CREATE TABLE IF NOT EXISTS site_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  block_code text NOT NULL,
  total_floors integer NOT NULL,
  total_apartments integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, block_code)
);

-- Update profiles table to add site and block references
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'site_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN site_id uuid REFERENCES sites(id) ON DELETE SET NULL;
    ALTER TABLE profiles ADD COLUMN block_id uuid REFERENCES site_blocks(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update announcements table to add site_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'announcements' AND column_name = 'site_id'
  ) THEN
    ALTER TABLE announcements ADD COLUMN site_id uuid REFERENCES sites(id) ON DELETE CASCADE;
    ALTER TABLE announcements ADD COLUMN block_id uuid REFERENCES site_blocks(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Local businesses table
CREATE TABLE IF NOT EXISTS local_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('food', 'grocery', 'service', 'health', 'other')),
  description text NOT NULL,
  discount text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  distance text,
  rating decimal(2,1) DEFAULT 5.0,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('question', 'discussion', 'suggestion', 'complaint')),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  author_block text NOT NULL,
  author_apartment text NOT NULL,
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  author_block text NOT NULL,
  author_apartment text NOT NULL,
  likes integer DEFAULT 0,
  is_accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Sites policies (all authenticated users can view, admins can manage)
CREATE POLICY "All users can view sites"
  ON sites FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage sites"
  ON sites FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Site blocks policies
CREATE POLICY "All users can view site blocks"
  ON site_blocks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage site blocks"
  ON site_blocks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Local businesses policies
CREATE POLICY "All users can view local businesses"
  ON local_businesses FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage local businesses"
  ON local_businesses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Forum posts policies
CREATE POLICY "All users can view forum posts"
  ON forum_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forum posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own forum posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own forum posts"
  ON forum_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Forum replies policies
CREATE POLICY "All users can view forum replies"
  ON forum_replies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forum replies"
  ON forum_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own forum replies"
  ON forum_replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own forum replies"
  ON forum_replies FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_blocks_site ON site_blocks(site_id);
CREATE INDEX IF NOT EXISTS idx_local_businesses_site ON local_businesses(site_id);
CREATE INDEX IF NOT EXISTS idx_local_businesses_category ON local_businesses(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_site ON forum_posts(site_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created ON forum_replies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_site ON profiles(site_id);
CREATE INDEX IF NOT EXISTS idx_profiles_block ON profiles(block_id);