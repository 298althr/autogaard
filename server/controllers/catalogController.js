const { pool } = require('../config/database');

class CatalogController {
    /**
     * Get all unique brands (makes)
     */
    async getBrands(req, res, next) {
        try {
            const result = await pool.query('SELECT DISTINCT make as name FROM vehicle_catalog ORDER BY make ASC');
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
            const { q, make } = req.query;
            let result;
            if (q) {
                const term = `%${q}%`;
                result = await pool.query(`
                    SELECT id, make as brand_name, model as name, image_url as photos
                    FROM vehicle_catalog 
                    WHERE make ILIKE $1 OR model ILIKE $1
                    ORDER BY make ASC, model ASC 
                    LIMIT 20
                `, [term]);
            } else if (make) {
                result = await pool.query(`
                    SELECT id, make as brand_name, model as name, image_url as photos 
                    FROM vehicle_catalog 
                    WHERE make = $1 
                    ORDER BY model ASC
                `, [make]);
            } else {
                result = await pool.query('SELECT id, make as brand_name, model as name, image_url as photos FROM vehicle_catalog ORDER BY model ASC');
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
            if (modelId) {
                result = await pool.query('SELECT id, name FROM engines WHERE automobile_id = $1 ORDER BY name ASC', [modelId]);
            } else {
                result = await pool.query('SELECT id, name, specs FROM engines ORDER BY name ASC');
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
