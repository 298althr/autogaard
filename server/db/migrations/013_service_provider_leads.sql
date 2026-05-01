-- Create table for service provider leads
CREATE TABLE IF NOT EXISTS leads_service_provider (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    service_address TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service_description TEXT NOT NULL,
    website VARCHAR(255),
    social_media VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_service_provider_email ON leads_service_provider(email);
CREATE INDEX IF NOT EXISTS idx_leads_service_provider_status ON leads_service_provider(status);
