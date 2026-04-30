const { pool } = require('../config/database');
const archetypes = require('../config/archetypes.json');

exports.getCatalog = async (req, res) => {
    try {
        const { make, body_type, search, limit = 12, offset = 0 } = req.query;
        let query = 'SELECT * FROM vehicle_catalog';
        const params = [];

        const conditions = [];
        if (make) {
            conditions.push(`make = $${params.length + 1}`);
            params.push(make);
        }
        if (body_type) {
            conditions.push(`body_type = $${params.length + 1}`);
            params.push(body_type);
        }
        if (search) {
            conditions.push(`(make ILIKE $${params.length + 1} OR model ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY popularity_index DESC';

        // Add pagination
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await pool.query(query, params);
        
        // Also get total count for pagination UI if needed
        const countQuery = conditions.length > 0 
            ? `SELECT COUNT(*) FROM vehicle_catalog WHERE ${conditions.join(' AND ')}`
            : `SELECT COUNT(*) FROM vehicle_catalog`;
        const countParams = conditions.length > 0 ? params.slice(0, -2) : [];
        const countResult = await pool.query(countQuery, countParams);

        res.json({
            success: true,
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch catalog' });
    }
};

exports.getVehicles = async (req, res) => {
    try {
        const { make, model, condition, minPrice, maxPrice, status, search, sort } = req.query;
        let query = 'SELECT * FROM vehicles';
        const params = [];
        const conditions = [];

        if (make) {
            conditions.push(`make ILIKE $${params.length + 1}`);
            params.push(make);
        }
        if (model) {
            conditions.push(`model ILIKE $${params.length + 1}`);
            params.push(model);
        }
        if (condition) {
            conditions.push(`condition = $${params.length + 1}`);
            params.push(condition);
        }
        if (minPrice) {
            conditions.push(`price >= $${params.length + 1}`);
            params.push(minPrice);
        }
        if (maxPrice) {
            conditions.push(`price <= $${params.length + 1}`);
            params.push(maxPrice);
        }
        if (status) {
            conditions.push(`status = $${params.length + 1}`);
            params.push(status);
        }
        if (search) {
            conditions.push(`(make ILIKE $${params.length + 1} OR model ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Sorting
        if (sort === 'popularity') {
            query += ' ORDER BY trust_score DESC';
        } else {
            query += ' ORDER BY created_at DESC';
        }

        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch vehicles' });
    }
};

exports.getVehicleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await pool.query('SELECT * FROM vehicle_catalog WHERE slug = $1', [slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        let vehicle = result.rows[0];

        // --- EXPERT ENGINE INJECTION ---
        const archetype = archetypes[vehicle.make] || {
            reliability: 7,
            parts_availability: 'Moderate',
            resale_velocity: 7,
            maintenance_profile: 'Standard (5,000km)',
            brand_traits: ['Practicality', 'Transportation'],
            common_issues: ['Standard wear and tear', 'Battery maintenance']
        };

        // 1. Expert Insight Template
        if (!vehicle.expert_insight) {
            vehicle.expert_insight = `${vehicle.make} ${vehicle.model} is a prominent choice in the Nigerian ${vehicle.body_type} segment. Known for its ${archetype.brand_traits[0].toLowerCase()} and ${archetype.brand_traits[1].toLowerCase()}, it remains a strong contender for those prioritizing ${archetype.brand_traits[2] ? archetype.brand_traits[2].toLowerCase() : 'reliability'}.`;
        }

        // 2. Strengths & Trade-offs
        if (!vehicle.key_strengths || vehicle.key_strengths.length === 0) {
            vehicle.key_strengths = [...archetype.brand_traits];
            if (vehicle.body_type === 'SUV') vehicle.key_strengths.push('High ground clearance');
            if (vehicle.body_type === 'Sedan') vehicle.key_strengths.push('Better fuel economy');
        }
        
        if (!vehicle.trade_offs || vehicle.trade_offs.length === 0) {
            vehicle.trade_offs = [archetype.common_issues[0]];
            if (vehicle.make === 'Mercedes-Benz' || vehicle.make === 'BMW') vehicle.trade_offs.push('Higher maintenance cost');
            if (vehicle.body_type === 'SUV') vehicle.trade_offs.push('Higher fuel consumption');
        }

        // 3. Maintenance & Common Issues
        if (!vehicle.maintenance_tips || vehicle.maintenance_tips.length === 0) {
            vehicle.maintenance_tips = [archetype.maintenance_profile, 'Check suspension bushings regularly on Nigerian roads'];
        }
        
        if (!vehicle.common_issues || vehicle.common_issues.length === 0) {
            vehicle.common_issues = archetype.common_issues;
        }

        // 4. Scores & Market Data
        vehicle.trust_score = vehicle.trust_score || archetype.reliability;
        vehicle.resell_rank = vehicle.resell_rank || archetype.resale_velocity;
        vehicle.parts_availability = vehicle.parts_availability || archetype.parts_availability;

        // 5. Dynamic Era Calculation
        if (!vehicle.era_text) {
            vehicle.era_text = `${vehicle.year_start} — ${vehicle.year_end || 'Present'}`;
        }

        // 6. Algorithmic Price Estimation (If missing)
        // Heuristic: Base price for Tokunbo is ~N15M for 10yr old luxury SUV, N8M for economy
        if (!vehicle.price_tokunbo_min) {
            const age = new Date().getFullYear() - (vehicle.year_start || 2015);
            const base = vehicle.make === 'Toyota' || vehicle.make === 'Lexus' || vehicle.make === 'Mercedes-Benz' ? 25 : 12;
            const dep = vehicle.make === 'Toyota' || vehicle.make === 'Lexus' ? 0.92 : 0.85;
            const estimatedTokunbo = base * Math.pow(dep, age);
            
            vehicle.price_tokunbo_min = Math.max(3, Math.round(estimatedTokunbo));
            vehicle.price_tokunbo_max = Math.max(5, Math.round(estimatedTokunbo * 1.5));
            vehicle.price_nigerian_min = Math.max(2, Math.round(estimatedTokunbo * 0.6));
            vehicle.price_nigerian_max = Math.max(3, Math.round(estimatedTokunbo * 0.9));
        }

        // 7. Alternatives Suggestion Algorithm
        const alternativesResult = await pool.query(`
            SELECT id, make, model, slug, image_url, resell_rank 
            FROM vehicle_catalog 
            WHERE body_type = $1 AND id != $2 
            ORDER BY resell_rank DESC 
            LIMIT 3
        `, [vehicle.body_type, vehicle.id]);
        
        vehicle.alternatives = alternativesResult.rows;
        // --- END EXPERT ENGINE ---

        res.json({
            success: true,
            data: vehicle
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch vehicle details' });
    }
};
