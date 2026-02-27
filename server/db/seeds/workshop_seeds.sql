-- Seed Data for Workshop Services & Partners

-- 1. Populate Services
INSERT INTO workshop_services (category, title, description, base_price, impact_multiplier, estimated_duration_days) VALUES
-- Diagnostics
('diagnostics', 'Engine Scan & Analysis', 'Full OBD-II diagnostic scan with report', 15000, 1.05, 1),
('diagnostics', '120-Point Audit', 'Comprehensive bumper-to-bumper inspection', 45000, 1.10, 2),
('diagnostics', 'VIN History Check', 'Global market history and accident report', 10000, 1.05, 1),
-- Registration
('registration', 'License Renewal', 'Standard vehicle license renewal', 25000, 1.00, 3),
('registration', 'Roadworthiness Cert', 'VIO inspection and certification', 15000, 1.02, 2),
('registration', 'Police CMR', 'Central Motor Registry verification', 12000, 1.00, 2),
-- Performance
('performance', 'Sequential CNG Conversion', '65L Tank with automated switching', 750000, 1.25, 5),
('performance', 'AC Optimization', 'Compressor refill and filter upgrade', 55000, 1.10, 1),
('performance', 'Security & Tech Suite', 'GPS Tracking, Dashcam, and Remote Start', 180000, 1.15, 2),
-- Refurbishment
('refurbishment', 'Custom Repaint', 'Glassurit paint with class-based pricing', 450000, 1.30, 14),
('refurbishment', 'Detailing & Ceramic Shield', 'PPF protection and deep cleaning', 120000, 1.15, 3),
-- Logistics
('logistics', 'Customs Duty Clearing', 'Terminal release and duty payment facilitation', 50000, 1.00, 7),
('logistics', 'Interstate Haulage', 'Professional car carrier transport', 150000, 1.00, 5),
-- Insurance
('insurance', 'Comprehensive Cover', 'All-risk protection with flood extension', 250000, 1.10, 2);

-- 2. Populate Partners
INSERT INTO workshop_partners (name, specialization, location, is_verified, contact_phone) VALUES
('AutoCraft Lagos', '{"mechanical", "detailing"}', 'Lekki Phase 1, Lagos', true, '08012345678'),
('Terminal Pro Logistics', '{"logistics"}', 'Apapa, Lagos', true, '08098765432'),
('LegalShield Compliance', '{"legal"}', 'Central Business Dist, Abuja', true, '08011122233'),
('Leadway Insurance', '{"insurance"}', 'Victoria Island, Lagos', true, '0800LEADWAY');
