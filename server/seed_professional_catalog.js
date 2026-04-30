const { pool } = require('./config/database');

async function fixCatalogUuidAndSeed() {
    const client = await pool.connect();
    try {
        console.log('--- Ensuring UUID Default and Seeding Catalog ---');
        
        // Ensure id has a default UUID generator
        await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
        await client.query(`ALTER TABLE vehicle_catalog ALTER COLUMN id SET DEFAULT gen_random_uuid()`);

        // Clear existing catalog
        await client.query('TRUNCATE TABLE vehicle_catalog CASCADE');
        
        const vehicles = [
            // TOYOTA
            {
                make: 'Toyota', model: 'Camry', slug: 'toyota-camry', body_type: 'Sedan', fuel_type: 'Gasoline',
                year_start: 2003, year_end: 2024, resell_rank: 10, popularity_index: 100,
                description: 'The king of the Nigerian road. Unbeatable reliability and parts availability.'
            },
            {
                make: 'Toyota', model: 'Corolla', slug: 'toyota-corolla', body_type: 'Sedan', fuel_type: 'Gasoline',
                year_start: 2003, year_end: 2024, resell_rank: 10, popularity_index: 95,
                description: 'The definitive choice for fuel economy and long-term durability.'
            },
            {
                make: 'Toyota', model: 'Highlander', slug: 'toyota-highlander', body_type: 'SUV', fuel_type: 'Gasoline',
                year_start: 2001, year_end: 2024, resell_rank: 9, popularity_index: 90,
                description: 'Premium family SUV with exceptional resale value and comfort.'
            },
            {
                make: 'Toyota', model: 'Hilux', slug: 'toyota-hilux', body_type: 'Pickup', fuel_type: 'Diesel/Gasoline',
                year_start: 2005, year_end: 2024, resell_rank: 10, popularity_index: 85,
                description: 'Indestructible workhorse favored for Nigerian terrain and corporate fleets.'
            },
            // LEXUS
            {
                make: 'Lexus', model: 'ES350', slug: 'lexus-es350', body_type: 'Sedan', fuel_type: 'Gasoline',
                year_start: 2007, year_end: 2024, resell_rank: 9, popularity_index: 92,
                description: 'Luxury combined with Toyota reliability. The favorite of the Lagos elite.'
            },
            {
                make: 'Lexus', model: 'RX350', slug: 'lexus-rx350', body_type: 'SUV', fuel_type: 'Gasoline',
                year_start: 2004, year_end: 2024, resell_rank: 9, popularity_index: 94,
                description: 'The benchmark for luxury SUVs in Nigeria. Extremely high demand.'
            },
            // HONDA
            {
                make: 'Honda', model: 'Accord', slug: 'honda-accord', body_type: 'Sedan', fuel_type: 'Gasoline',
                year_start: 2003, year_end: 2024, resell_rank: 8, popularity_index: 80,
                description: 'Sporty driving dynamics and advanced technology. High popularity for modern users.'
            },
            // MERCEDES-BENZ
            {
                make: 'Mercedes-Benz', model: 'C-Class', slug: 'mercedes-c300', body_type: 'Sedan', fuel_type: 'Gasoline',
                year_start: 2008, year_end: 2024, resell_rank: 8, popularity_index: 88,
                description: 'The entry point to German luxury. Prestigious and surprisingly rugged.'
            },
            {
                make: 'Mercedes-Benz', model: 'G-Wagon', slug: 'mercedes-g-wagon', body_type: 'SUV', fuel_type: 'Gasoline',
                year_start: 1990, year_end: 2024, resell_rank: 9, popularity_index: 70,
                description: 'The ultimate status symbol on Nigerian roads. Retains value exceptionally well.'
            },
            // LAND ROVER
            {
                make: 'Land Rover', model: 'Range Rover Sport', slug: 'range-rover-sport', body_type: 'SUV', fuel_type: 'Gasoline/Diesel',
                year_start: 2005, year_end: 2024, resell_rank: 7, popularity_index: 75,
                description: 'Luxury off-road capability. High maintenance but extreme prestige.'
            },
            // KIA & HYUNDAI
            {
                make: 'Kia', model: 'Rio', slug: 'kia-rio', body_type: 'Sedan', fuel_type: 'Gasoline',
                year_start: 2012, year_end: 2024, resell_rank: 7, popularity_index: 65,
                description: 'Excellent value for money and modern design. Very popular for ride-hailing.'
            },
            {
                make: 'Hyundai', model: 'Elantra', slug: 'hyundai-elantra', body_type: 'Sedan', fuel_type: 'Gasoline',
                year_start: 2011, year_end: 2024, resell_rank: 8, popularity_index: 70,
                description: 'Sleek design and great fuel economy. A rising star in the local market.'
            },
            // NISSAN
            {
                make: 'Nissan', model: 'Altima', slug: 'nissan-altima', body_type: 'Sedan', fuel_type: 'Gasoline',
                year_start: 2007, year_end: 2024, resell_rank: 7, popularity_index: 60,
                description: 'Comfortable and affordable alternative to the big two sedans.'
            },
            // FORD
            {
                make: 'Ford', model: 'Explorer', slug: 'ford-explorer', body_type: 'SUV', fuel_type: 'Gasoline',
                year_start: 2011, year_end: 2024, resell_rank: 7, popularity_index: 55,
                description: 'American muscle and space. Popular choice for large families.'
            }
        ];

        for (const v of vehicles) {
            const query = `
                INSERT INTO vehicle_catalog 
                (make, model, slug, body_type, fuel_type, year_start, year_end, resell_rank, popularity_index, description, image_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `;
            const imageUrl = `https://source.unsplash.com/800x600/?car,${v.make},${v.model}`;
            await client.query(query, [
                v.make, v.model, v.slug, v.body_type, v.fuel_type, 
                v.year_start, v.year_end, v.resell_rank, v.popularity_index, 
                v.description, imageUrl
            ]);
        }

        // Add additional brands
        const otherMakes = ['Audi', 'BMW', 'Acura', 'Infiniti', 'Chevrolet', 'GMC', 'Ram'];
        for (const make of otherMakes) {
             const query = `
                INSERT INTO vehicle_catalog 
                (make, model, slug, body_type, fuel_type, year_start, year_end, resell_rank, popularity_index, description, image_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `;
            const model = make === 'BMW' ? 'X5' : 'Generic Model';
            const slug = `${make.toLowerCase()}-model`;
            await client.query(query, [
                make, model, slug, 'SUV', 'Gasoline', 2010, 2024, 8, 50, 
                `Premium ${make} models are popular for their build quality and luxury.`,
                `https://source.unsplash.com/800x600/?car,${make}`
            ]);
        }

        console.log('✅ Catalog seeded with professional Nigerian data');

        // Apply metadata
        const updateQuery = `
            UPDATE vehicle_catalog 
            SET 
                pros = ARRAY['Reliability', 'Good Fuel Economy', 'Great Resale Value'],
                cons = ARRAY['High Purchase Price', 'Basic Tech (Base Models)'],
                common_issues = ARRAY['Standard Wear and Tear'],
                maintenance_tips = ARRAY['Service every 5,000km'],
                price_range_tokunbo = '₦5M - ₦15M',
                price_range_local = '₦3M - ₦10M'
            WHERE pros = '{}' OR pros IS NULL
        `;
        await client.query(updateQuery);
        console.log('✅ Authority metadata applied to all records');

    } catch (err) {
        console.error('❌ Error during setup:', err.message);
    } finally {
        client.release();
        process.exit();
    }
}

fixCatalogUuidAndSeed();
