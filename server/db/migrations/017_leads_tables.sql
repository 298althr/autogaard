-- Lead Tables for Autogaard Cinematic Refactor

-- 1. General Contact Leads
CREATE TABLE IF NOT EXISTS leads_contact (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, closed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Buying Consultation Leads
CREATE TABLE IF NOT EXISTS leads_buy (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    budget VARCHAR(100),
    vehicle_type VARCHAR(100),
    preferred_make VARCHAR(100),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Selling Consultation Leads
CREATE TABLE IF NOT EXISTS leads_sell (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    year INTEGER,
    ownership_years INTEGER,
    condition VARCHAR(100),
    asking_price VARCHAR(100),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inspection Leads
CREATE TABLE IF NOT EXISTS leads_inspection (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    year INTEGER,
    service_type VARCHAR(100), -- Engine Scan, 120-Point Audit, etc.
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Paperwork Leads
CREATE TABLE IF NOT EXISTS leads_paperwork (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    year INTEGER,
    document_type VARCHAR(100), -- Renewals, CMR, etc.
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Technology Leads
CREATE TABLE IF NOT EXISTS leads_technology (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    year INTEGER,
    service_interest VARCHAR(100), -- CNG, AC, Security, etc.
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Restoration Leads
CREATE TABLE IF NOT EXISTS leads_restoration (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    year INTEGER,
    service_interest VARCHAR(100), -- Repaint, Detailing, etc.
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Logistics Leads
CREATE TABLE IF NOT EXISTS leads_logistics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    year INTEGER,
    route_from VARCHAR(255),
    route_to VARCHAR(255),
    service_type VARCHAR(100), -- Clearing, Haulage, etc.
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Valuation Leads
CREATE TABLE IF NOT EXISTS leads_valuation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    year INTEGER,
    estimated_value VARCHAR(100),
    action VARCHAR(50), -- buy/sell
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Comparison Leads
CREATE TABLE IF NOT EXISTS leads_comparison (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    vehicles_compared TEXT,
    preferred_choice VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Vehicle Inquiry Leads
CREATE TABLE IF NOT EXISTS leads_vehicle_inquiry (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    budget VARCHAR(100),
    vehicle_id INTEGER,
    intent VARCHAR(50), -- buy/general
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Autoconcierge Waitlist
CREATE TABLE IF NOT EXISTS leads_waitlist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
