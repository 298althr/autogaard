-- Migration 014: Vehicle Privacy
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;
