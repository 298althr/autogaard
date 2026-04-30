const { pool } = require('../config/database');

class CatalogController {
    /**
     * Get all unique brands (makes)
     */
    async getBrands(req, res, next) {
        try {
            // Prefer the expert 'brands' table for valuation/trim flows
            const result = await pool.query('SELECT id, name FROM brands ORDER BY name ASC');
            // If brands table is empty, fallback to vehicle_catalog
            if (result.rows.length === 0) {
                const fallback = await pool.query('SELECT DISTINCT make as name FROM vehicle_catalog ORDER BY make ASC');
                return res.status(200).json({ success: true, data: fallback.rows });
            }
            res.status(200).json({
                success: true,
                data: result.rows
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get models for a specific brand
     */
    async getModels(req, res, next) {
        try {
            const { q, make, makeId } = req.query;
            let result;
            
            if (makeId) {
                // Query automobiles (expert catalog) to ensure integer IDs for engines
                result = await pool.query(`
                    SELECT id, name, photos 
                    FROM automobiles 
                    WHERE brand_id = $1 
                    ORDER BY name ASC
                `, [makeId]);
            } else if (make) {
                // Fallback search by name
                result = await pool.query(`
                    SELECT a.id, b.name as brand_name, a.name, a.photos 
                    FROM automobiles a
                    JOIN brands b ON a.brand_id = b.id
                    WHERE b.name ILIKE $1 
                    ORDER BY a.name ASC
                `, [make]);
            } else if (q) {
                const term = `%${q}%`;
                result = await pool.query(`
                    SELECT a.id, b.name as brand_name, a.name, a.photos
                    FROM automobiles a
                    JOIN brands b ON a.brand_id = b.id
                    WHERE b.name ILIKE $1 OR a.name ILIKE $1
                    ORDER BY b.name ASC, a.name ASC 
                    LIMIT 20
                `, [term]);
            } else {
                result = await pool.query('SELECT id, name, photos FROM automobiles ORDER BY name ASC LIMIT 100');
            }

            res.status(200).json({
                success: true,
                data: result.rows
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get engines for a specific model (used for trim/variant selection)
     */
    async getEngines(req, res, next) {
        try {
            const { modelId } = req.query;
            let result;
            
            // Safety: Check if modelId is a valid integer string before querying
            if (modelId && !isNaN(parseInt(modelId))) {
                result = await pool.query('SELECT id, name, specs FROM engines WHERE automobile_id = $1 ORDER BY name ASC', [modelId]);
            } else if (modelId) {
                // If it's a UUID or other string, return empty (graceful failure)
                return res.status(200).json({ success: true, data: [] });
            } else {
                result = await pool.query('SELECT id, name, specs FROM engines ORDER BY name ASC LIMIT 100');
            }
            const data = result.rows.map(row => {
                let parsedSpecs = row.specs;
                if (typeof row.specs === 'string') {
                    try {
                        parsedSpecs = JSON.parse(row.specs);
                    } catch (e) {
                        parsedSpecs = {};
                    }
                }
                return { ...row, specs: parsedSpecs };
            });

            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Compare multiple vehicles using the expert catalog
     */
    async compare(req, res, next) {
        try {
            const { ids } = req.query;
            if (!ids) {
                return res.status(400).json({ success: false, message: 'IDs are required' });
            }
            const idArray = ids.split(',')
                               .map(id => id.trim())
                               .filter(id => id.length > 0);
            
            if (idArray.length === 0) {
                return res.status(200).json({ success: true, data: [] });
            }

            const result = await pool.query(`
                SELECT id, make, model, year_start, year_end, image_url, body_type, fuel_type, reliability_score, resell_rank, description, specs
                FROM vehicle_catalog
                WHERE id::text = ANY($1)
            `, [idArray]);

            // Hydrate with virtual fields if needed
            const automobiles = result.rows.map(v => ({
                ...v,
                expert_insight: v.description, // Fallback
                features: v.specs // Map specs to features for frontend
            }));

            res.status(200).json({
                success: true,
                data: automobiles
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CatalogController();
