const { pool } = require('../../config/database');

const VEHICLES = [
    {
        make: 'Toyota', model: 'Corolla', year_start: 2003, year_end: 2008, 
        slug: 'toyota-corolla-2003-2008', body_type: 'Sedan', fuel_type: 'Petrol',
        description: 'The "unbreakable" classic. Known for extreme reliability and fuel economy in the Nigerian market.',
        image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
        resell_rank: 10, popularity_index: 100
    },
    {
        make: 'Toyota', model: 'Camry', year_start: 2007, year_end: 2011,
        slug: 'toyota-camry-muscle', body_type: 'Sedan', fuel_type: 'Petrol',
        description: 'Commonly called the "Muscle" Camry. A staple of the Nigerian middle class with great comfort and parts availability.',
        image_url: 'https://images.unsplash.com/photo-1623998021450-83486ba92794?auto=format&fit=crop&w=800&q=80',
        resell_rank: 9, popularity_index: 95
    },
    {
        make: 'Lexus', model: 'ES 350', year_start: 2007, year_end: 2012,
        slug: 'lexus-es350-2007', body_type: 'Sedan', fuel_type: 'Petrol',
        description: 'Luxury meets reliability. The ES 350 is the gold standard for premium entry-level luxury in Lagos.',
        image_url: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=800&q=80',
        resell_rank: 9, popularity_index: 90
    },
    {
        make: 'Lexus', model: 'RX 350', year_start: 2010, year_end: 2015,
        slug: 'lexus-rx350-2010', body_type: 'SUV', fuel_type: 'Petrol',
        description: 'The king of luxury SUVs in Nigeria. Excellent resale value and smooth driving experience.',
        image_url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
        resell_rank: 10, popularity_index: 98
    },
    {
        make: 'Honda', model: 'Accord', year_start: 2008, year_end: 2012,
        slug: 'honda-accord-evil-spirit', body_type: 'Sedan', fuel_type: 'Petrol',
        description: 'The "Evil Spirit" Accord. Loved for its sporty handling and futuristic interior, though it requires specialized care.',
        image_url: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80',
        resell_rank: 7, popularity_index: 85
    },
    {
        make: 'Toyota', model: 'Highlander', year_start: 2008, year_end: 2013,
        slug: 'toyota-highlander-2008', body_type: 'SUV', fuel_type: 'Petrol',
        description: 'A family favorite. Spacious, reliable, and holds its value incredibly well in the used market.',
        image_url: 'https://images.unsplash.com/photo-1550064824-8f993041ffd3?auto=format&fit=crop&w=800&q=80',
        resell_rank: 9, popularity_index: 88
    },
    {
        make: 'Toyota', model: 'Sienna', year_start: 2004, year_end: 2010,
        slug: 'toyota-sienna-2004', body_type: 'Minivan', fuel_type: 'Petrol',
        description: 'The ultimate Nigerian family van. Used widely for both private family trips and premium interstate transport.',
        image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80',
        resell_rank: 8, popularity_index: 80
    },
    {
        make: 'Mercedes-Benz', model: 'C 300', year_start: 2008, year_end: 2014,
        slug: 'mercedes-c300-w204', body_type: 'Sedan', fuel_type: 'Petrol',
        description: 'The W204 C-Class. Iconic design and very popular for young professionals looking for German engineering.',
        image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
        resell_rank: 8, popularity_index: 92
    },
    {
        make: 'Toyota', model: 'Venza', year_start: 2009, year_end: 2015,
        slug: 'toyota-venza-2009', body_type: 'Crossover', fuel_type: 'Petrol',
        description: 'Stylish and unique. The Venza carved a niche for itself as a status symbol in the early 2010s.',
        image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
        resell_rank: 8, popularity_index: 85
    },
    {
        make: 'Toyota', model: 'Hilux', year_start: 2012, year_end: 2020,
        slug: 'toyota-hilux-2012', body_type: 'Pickup', fuel_type: 'Diesel/Petrol',
        description: 'The workhorse of Nigeria. Used by corporations, security, and individuals who need rugged performance.',
        image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
        resell_rank: 10, popularity_index: 95
    }
];

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Seeding vehicle catalog...');
        await client.query('BEGIN');

        for (const v of VEHICLES) {
            await client.query(
                `INSERT INTO vehicle_catalog 
                (make, model, year_start, year_end, slug, body_type, fuel_type, description, image_url, resell_rank, popularity_index) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (slug) DO UPDATE SET
                description = EXCLUDED.description,
                image_url = EXCLUDED.image_url,
                resell_rank = EXCLUDED.resell_rank`,
                [v.make, v.model, v.year_start, v.year_end, v.slug, v.body_type, v.fuel_type, v.description, v.image_url, v.resell_rank, v.popularity_index]
            );
        }

        await client.query('COMMIT');
        console.log('✅ Seeding complete!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Seeding failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
