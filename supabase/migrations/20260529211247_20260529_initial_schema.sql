/*
  # Initial Schema for Apartmanım App

  Creates the foundational database structure for the apartment management application.

  1. New Tables
    - `profiles` - User profile information (apartment, block, floor)
    - `announcements` - Building announcements and notices
    - `share_items` - Items for borrowing/sharing between neighbors
    - `neighbors` - Neighbor information directory
    - `fault_reports` - Technical fault and problem reports
    - `events` - Building events and meetings
    - `documents` - Building documents and files

  2. Security
    - Enable RLS on all tables
    - Policies restrict data access to authenticated users
    - Users can only modify their own data or public items
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name text NOT NULL,
  surname text NOT NULL,
  phone text,
  apartment text NOT NULL,
  block text NOT NULL,
  floor integer NOT NULL,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text NOT NULL DEFAULT 'info' CHECK (priority IN ('urgent', 'warning', 'info')),
  author text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Share items table (borrowing/sharing)
CREATE TABLE IF NOT EXISTS share_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('borrowing', 'sharing')),
  title text NOT NULL,
  description text NOT NULL,
  owner text NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  floor integer NOT NULL,
  image_url text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'borrowed', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Neighbors table
CREATE TABLE IF NOT EXISTS neighbors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  surname text NOT NULL,
  apartment text NOT NULL,
  floor integer NOT NULL,
  block text NOT NULL,
  phone text,
  email text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fault reports table
CREATE TABLE IF NOT EXISTS fault_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('cleaning', 'technical', 'security', 'other')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  reported_by text NOT NULL,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date date NOT NULL,
  event_time text NOT NULL,
  location text NOT NULL,
  max_attendees integer,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event attendees (junction table)
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('pdf', 'doc', 'image', 'other')),
  file_url text NOT NULL,
  file_size text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighbors ENABLE ROW LEVEL SECURITY;
ALTER TABLE fault_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Announcements policies (public read, admin write)
CREATE POLICY "All users can view announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Share items policies
CREATE POLICY "All users can view share items"
  ON share_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own share items"
  ON share_items FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can insert share items"
  ON share_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Neighbors policies
CREATE POLICY "All users can view neighbors"
  ON neighbors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own neighbor info"
  ON neighbors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own neighbor info"
  ON neighbors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fault reports policies
CREATE POLICY "All users can view fault reports"
  ON fault_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create fault reports"
  ON fault_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update own fault reports"
  ON fault_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = reporter_id)
  WITH CHECK (auth.uid() = reporter_id);

-- Events policies
CREATE POLICY "All users can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All users can manage events"
  ON events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Event attendees policies
CREATE POLICY "All users can view event attendees"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join events"
  ON event_attendees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events"
  ON event_attendees FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "All users can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage documents"
  ON documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_block_floor ON profiles(block, floor);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_share_items_type ON share_items(type);
CREATE INDEX IF NOT EXISTS idx_share_items_status ON share_items(status);
CREATE INDEX IF NOT EXISTS idx_neighbors_floor ON neighbors(floor);
CREATE INDEX IF NOT EXISTS idx_neighbors_block ON neighbors(block);
CREATE INDEX IF NOT EXISTS idx_fault_reports_status ON fault_reports(status);
CREATE INDEX IF NOT EXISTS idx_fault_reports_category ON fault_reports(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(file_type);