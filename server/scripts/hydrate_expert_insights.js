const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function hydrate() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Autogaard Database');

        const researchData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../gemini-code-1777564606732.json'), 'utf8'));
        
        for (const [brand, models] of Object.entries(researchData)) {
            console.log(`Processing brand: ${brand}`);
            
            for (const data of models) {
                const { model, reliability, resale_velocity, maintenance_profile, brand_traits, common_issues } = data;
                
                if (!model) {
                    console.log(`⏩ Skipping empty model entry in ${brand}`);
                    continue;
                }
                
                // 1. Build Expert Insight Algorithmically
                const traits = Array.isArray(brand_traits) ? brand_traits : [];
                const issues = Array.isArray(common_issues) ? common_issues : [];
                
                const traitSummary = traits.length > 0 ? traits.slice(0, 2).join(' and ') : 'proven engineering';
                const insight = `${brand} ${model} is defined by its ${traitSummary}. For the Nigerian market, it offers ${reliability > 8 ? 'exceptional' : 'solid'} mechanical longevity, provided it follows a ${maintenance_profile || 'standard'} schedule.`;
                
                // 2. Map Metrics
                const reliability_score = reliability ? Math.round(reliability * 10) : 70; // Scale to 100
                const resell_rank = resale_velocity ? Math.round(resale_velocity) : 7; // Scale to 10
                
                // 3. Build Maintenance Tips
                const tips = [
                    `Follow the ${maintenance_profile || 'Standard (5,000km)'} schedule rigorously.`,
                    `Monitor ${issues[0] || 'fluid levels'} every 3,000km.`,
                    `Ensure spare parts are sourced from ${data.parts_availability === 'High' ? 'reputable local markets' : 'specialized importers'}.`
                ];

                // 4. Update Database
                // Using a fuzzy match for the name (checking if name contains model)
                const updateQuery = `
                    UPDATE vehicle_catalog 
                    SET 
                        expert_insight = $1,
                        reliability_score = $2,
                        resell_rank = $3,
                        common_issues = $4,
                        maintenance_tips = $5,
                        pros = $6,
                        parts_availability = $7
                    WHERE 
                        make ILIKE $8 AND 
                        model ILIKE $9
                `;

                const res = await client.query(`
                    UPDATE vehicle_catalog 
                    SET 
                        expert_insight = $1,
                        reliability_score = $2,
                        resell_rank = $3,
                        common_issues = $4,
                        maintenance_tips = $5,
                        pros = $6,
                        parts_availability = $7
                    WHERE 
                        make ILIKE $8 AND 
                        (
                            REPLACE(REPLACE(model, ' ', ''), '-', '') ILIKE $9 OR
                            $9 ILIKE '%' || REPLACE(REPLACE(model, ' ', ''), '-', '') || '%'
                        )
                `, [
                    insight,
                    reliability_score,
                    resell_rank,
                    common_issues,
                    tips,
                    brand_traits,
                    data.parts_availability,
                    brand,
                    `%${model.replace(/\s/g, '').replace(/-/g, '')}%`
                ]);

                if (res.rowCount > 0) {
                    console.log(`✅ Updated ${brand} ${model} (${res.rowCount} entries)`);
                } else {
                    // Try exact match if fuzzy failed or handle as new potential seed
                    console.log(`⚠️ No record found for ${brand} ${model}`);
                }
            }
        }

        console.log('Hydration completed successfully.');

    } catch (err) {
        console.error('Hydration failed:', err);
    } finally {
        await client.end();
    }
}

hydrate();
