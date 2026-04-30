const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:hQsNPujESqTuGusPsPOBfDNfowhrQmPq@shuttle.proxy.rlwy.net:45100/railway',
  ssl: { rejectUnauthorized: false }
});

function escapeValue(val, pgDataType) {
  if (val === null || val === undefined) return 'NULL';

  if (val instanceof Date) {
    return `'${val.toISOString()}'`;
  }

  if (pgDataType === 'ARRAY' && Array.isArray(val)) {
    if (val.length === 0) return "'{}'";
    const items = val.map(v => {
      if (v === null) return 'NULL';
      return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    });
    return `'{${items.join(',')}}'`;
  }

  if (Array.isArray(val) || typeof val === 'object') {
    const json = JSON.stringify(val).replace(/'/g, "''");
    return `'${json}'`;
  }

  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';

  if (typeof val === 'number') {
    if (isNaN(val) || !isFinite(val)) return 'NULL';
    return String(val);
  }

  return "'" + String(val).replace(/'/g, "''") + "'";
}

function pgType(dataType) {
  const map = {
    'ARRAY': 'text[]',
    'integer': 'integer',
    'bigint': 'bigint',
    'smallint': 'smallint',
    'numeric': 'numeric',
    'double precision': 'double precision',
    'real': 'real',
    'boolean': 'boolean',
    'text': 'text',
    'character varying': 'character varying',
    'character': 'character',
    'uuid': 'uuid',
    'jsonb': 'jsonb',
    'json': 'json',
    'inet': 'inet',
    'timestamp without time zone': 'timestamp',
    'timestamp with time zone': 'timestamptz',
    'date': 'date',
    'time without time zone': 'time',
    'time with time zone': 'timetz',
  };
  return map[dataType] || dataType;
}

async function backup() {
  await client.connect();

  const tablesRes = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  const tables = tablesRes.rows.map(r => r.table_name);

  process.stdout.write('-- PostgreSQL Backup\n');
  process.stdout.write('-- Service: Postgres-Vx8J (Railway -> Supabase DB2)\n');
  process.stdout.write(`-- Generated: ${new Date().toISOString()}\n`);
  process.stdout.write(`-- Tables: ${tables.join(', ')}\n\n`);

  for (const table of tables) {
    const colsRes = await client.query(`
      SELECT column_name, data_type, is_nullable, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [table]);

    const colDefs = colsRes.rows.map(col => {
      let type = pgType(col.data_type);
      if (col.data_type === 'ARRAY') {
        const base = col.udt_name.replace(/^_/, '');
        type = `${base}[]`;
      }
      let def = `"${col.column_name}" ${type}`;
      if (col.is_nullable === 'NO') def += ' NOT NULL';
      return def;
    });
    process.stdout.write(`CREATE TABLE IF NOT EXISTS "${table}" (\n  ${colDefs.join(',\n  ')}\n);\n`);
  }
  process.stdout.write('\n');

  for (const table of tables) {
    const colTypeRes = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [table]);
    const colTypes = {};
    for (const r of colTypeRes.rows) colTypes[r.column_name] = r.data_type;

    const dataRes = await client.query(`SELECT * FROM "${table}"`);
    process.stdout.write(`\n-- Table: ${table} (${dataRes.rows.length} rows)\n`);

    if (dataRes.rows.length === 0) continue;

    const columns = Object.keys(dataRes.rows[0]);
    const colList = columns.map(c => `"${c}"`).join(', ');

    const batchSize = 500;
    for (let i = 0; i < dataRes.rows.length; i += batchSize) {
      const batch = dataRes.rows.slice(i, i + batchSize);
      const values = batch.map(row =>
        '(' + columns.map(col => escapeValue(row[col], colTypes[col])).join(', ') + ')'
      );
      process.stdout.write(`INSERT INTO "${table}" (${colList}) VALUES\n`);
      process.stdout.write(values.join(',\n') + ';\n');
    }
  }

  await client.end();
}

backup().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
