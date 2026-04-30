const { pool } = require('./config/database');

async function updateCatalogPhotos() {
    const client = await pool.connect();
    try {
        console.log('--- Updating Catalog Photos to Premium Studio Style ---');
        
        const { rows } = await client.query('SELECT id, make, model FROM vehicle_catalog');
        
        // Curated high-end car photos from Unsplash for a "Studio" look
        const studioPhotos = [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70', // Porsche (Studio)
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8', // Generic Lux
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf', // SUV
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2', // Interior/Detail
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d', // Sports
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7', // Modern
            'https://images.unsplash.com/photo-1553440569-bcc63803a83d', // SUV Lux
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888', // Premium
        ];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            // Rotate through high-quality studio photos to ensure a premium feel
            const photoUrl = studioPhotos[i % studioPhotos.length] + '?auto=format&fit=crop&q=80&w=1200';
            
            await client.query(
                'UPDATE vehicle_catalog SET image_url = $1 WHERE id = $2',
                [photoUrl, row.id]
            );
        }

        console.log('✅ Catalog photos upgraded to Studio Style');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        process.exit();
    }
}

updateCatalogPhotos();
