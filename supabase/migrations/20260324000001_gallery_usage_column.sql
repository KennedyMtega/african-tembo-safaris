-- Add usage column to gallery_items
-- Values: NULL = general gallery, 'hero' = hero slideshow, 'founder' = founder photo
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS usage text;

-- Index for fast lookups by usage
CREATE INDEX IF NOT EXISTS gallery_items_usage_idx ON gallery_items (usage);
