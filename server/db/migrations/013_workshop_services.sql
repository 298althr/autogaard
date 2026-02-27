-- Workshop Services & 14-Step Workflow Schema

-- 1. Available Services (Proprietary definitions)
CREATE TABLE IF NOT EXISTS workshop_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- 'diagnostics', 'registration', 'performance', etc.
    title VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(15, 2) DEFAULT 0,
    impact_multiplier DECIMAL(3, 2) DEFAULT 1.0, -- How much it increases vehicle value (e.g. 1.20 = 20% of cost adds to value)
    estimated_duration_days INTEGER DEFAULT 3,
    requirements JSONB DEFAULT '[]'::jsonb, -- ['vin_scan', 'proof_of_ownership']
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Service Partners (High-Stakes Ecosystem)
CREATE TABLE IF NOT EXISTS workshop_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(50)[], -- ['mechanical', 'legal', 'detailing']
    rating DECIMAL(3, 2) DEFAULT 5.0,
    location VARCHAR(100),
    capacity_limit INTEGER DEFAULT 10,
    active_tasks INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    commission_rate DECIMAL(5, 4) DEFAULT 0.10, -- 10% platform fee
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Service Requests (The 14-Step Lifecycle)
CREATE TABLE IF NOT EXISTS workshop_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES workshop_services(id),
    user_id UUID NOT NULL REFERENCES users(id),
    partner_id UUID REFERENCES workshop_partners(id),
    
    status_step INTEGER DEFAULT 1, -- 1 to 14
    status_label VARCHAR(50) DEFAULT 'Pending Intake',
    
    total_quoted_amount DECIMAL(15, 2) DEFAULT 0,
    escrow_status VARCHAR(20) DEFAULT 'none', -- ['none', 'locked', 'released', 'disputed']
    
    contract_signed_at TIMESTAMP WITH TIME ZONE,
    payment_received_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    metadata JSONB DEFAULT '{}'::jsonb, -- Store dynamic config like paint code, tank size, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Partner Quotes (Step 4 Logic)
CREATE TABLE IF NOT EXISTS workshop_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES workshop_requests(id) ON DELETE CASCADE,
    partner_id UUID NOT NULL REFERENCES workshop_partners(id),
    amount DECIMAL(15, 2) NOT NULL,
    note TEXT,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Workflow Audit Logs (Tight Mediation / Shadow Tracking)
CREATE TABLE IF NOT EXISTS workshop_workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES workshop_requests(id) ON DELETE CASCADE,
    from_step INTEGER,
    to_step INTEGER,
    actor_id UUID, -- Either user_id or partner_id or admin_id
    actor_type VARCHAR(20), -- 'user', 'partner', 'admin'
    ip_address INET,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Service Assets (Documentation Vault)
CREATE TABLE IF NOT EXISTS workshop_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES workshop_requests(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50), -- 'engine_scan', 'customs_paper', 'after_photo'
    uploaded_by UUID,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Feedback & Quality Review (Step 14)
CREATE TABLE IF NOT EXISTS workshop_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES workshop_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    partner_id UUID NOT NULL REFERENCES workshop_partners(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_workshop_requests_vehicle ON workshop_requests(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_workshop_requests_user ON workshop_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_requests_status ON workshop_requests(status_step);
CREATE INDEX IF NOT EXISTS idx_workshop_workflow_request ON workshop_workflow_history(request_id);
