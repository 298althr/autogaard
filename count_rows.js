const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:hQsNPujESqTuGusPsPOBfDNfowhrQmPq@shuttle.proxy.rlwy.net:45100/railway',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();

  const tables = ['complaints', 'recalls', 'temp_specs', 'vehicles'];
  for (const t of tables) {
    const r = await client.query(`SELECT COUNT(*) FROM "${t}"`);
    console.log(`${t}: ${r.rows[0].count} rows`);
  }

  await client.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
