const { pool } = require('./config/database');

async function updateCatalogPhotos() {
    const client = await pool.connect();
    try {
        console.log('--- DEPLOYING ELITE VISUAL SOURCING ENGINE ---');
        
        const { rows } = await client.query('SELECT id, make, model FROM vehicle_catalog');
        
        // Curated high-fidelity photos for the Nigerian Elite Fleet
        const modelPhotos = {
            'Toyota-Corolla': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb',
            'Toyota-Camry': 'https://images.unsplash.com/photo-1623998021450-83486ba92794',
            'Lexus-ES350': 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b',
            'Lexus-RX350': 'https://images.unsplash.com/photo-1590362891991-f776e747a588',
            'Honda-Accord': 'https://images.unsplash.com/photo-1592198084033-aade902d1aae',
            'Toyota-Highlander': 'https://images.unsplash.com/photo-1550064824-8f993041ffd3',
            'Toyota-Sienna': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a',
            'Mercedes-Benz-C300': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
            'Toyota-Hilux': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
            'BMW-X5': 'https://images.unsplash.com/photo-1555219507-da3b142c6e3d',
            'Range-Rover': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d'
        };

        const genericPhotos = [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'
        ];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const key = `${row.make}-${row.model}`.replace(/\s/g, '');
            
            // Priority 1: Curated Model Photo
            // Priority 2: Generic High-End Studio Photo
            let photoUrl = modelPhotos[key] || genericPhotos[i % genericPhotos.length];
            
            photoUrl += '?auto=format&fit=crop&q=80&w=1200';
            
            await client.query(
                'UPDATE vehicle_catalog SET image_url = $1 WHERE id = $2',
                [photoUrl, row.id]
            );
            
            console.log(`✅ ${row.make} ${row.model} -> ${photoUrl.substring(0, 50)}...`);
        }

        console.log('--- VISUAL RESTORATION COMPLETE ---');

    } catch (err) {
        console.error('❌ Visual Sourcing Error:', err.message);
    } finally {
        client.release();
        process.exit();
    }
}

updateCatalogPhotos();
