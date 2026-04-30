const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:hQsNPujESqTuGusPsPOBfDNfowhrQmPq@shuttle.proxy.rlwy.net:45100/railway',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();

  const r = await client.query(`
    SELECT table_schema, table_name,
      pg_size_pretty(pg_total_relation_size(quote_ident(table_schema)||'.'||quote_ident(table_name))) as size
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
      AND table_schema NOT IN ('pg_catalog','information_schema')
    ORDER BY table_schema, table_name
  `);

  console.log(`Found ${r.rows.length} tables:`);
  r.rows.forEach(x => console.log(`  ${x.table_schema}.${x.table_name}  (${x.size})`));

  await client.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
