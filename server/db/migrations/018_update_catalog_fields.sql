-- Update vehicle_catalog to include marketing fields for the educational catalog
ALTER TABLE vehicle_catalog 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS slug VARCHAR(150) UNIQUE;

-- Add index for slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_catalog_slug ON vehicle_catalog(slug);
