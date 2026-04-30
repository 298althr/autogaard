const { Client } = require('pg');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Parse .env file
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const key = trimmed.substring(0, eqIndex).trim();
      let value = trimmed.substring(eqIndex + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      env[key] = value;
    }
  }
  return env;
}

const env = loadEnv();
const DB_PASSWORD = env.DB2_PASSWORD;
const DATABASE_URL_RAW = env.DB2_URL;

if (!DB_PASSWORD || !DATABASE_URL_RAW) {
  console.error('Error: DB2_PASSWORD or DB2_URL not found in .env');
  console.error('Found keys:', Object.keys(env).join(', '));
  process.exit(1);
}

let DATABASE_URL = DATABASE_URL_RAW;
if (DATABASE_URL.includes('[YOUR-PASSWORD]')) {
  DATABASE_URL = DATABASE_URL.replace('[YOUR-PASSWORD]', DB_PASSWORD);
}

const maskedUrl = DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
console.log('Connecting to DB2:', maskedUrl);

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function importBackup(sqlFilePath) {
  await client.connect();
  console.log('Connected to database\n');

  const fileStream = fs.createReadStream(sqlFilePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let buffer = '';
  let statementCount = 0;
  let successCount = 0;
  let errorCount = 0;
  let lineNum = 0;

  console.log('Starting import...');

  for await (const line of rl) {
    lineNum++;
    if (line.startsWith('--') || line.trim() === '') continue;

    buffer += line + '\n';

    if (line.trim().endsWith(';')) {
      statementCount++;
      try {
        await client.query(buffer);
        successCount++;
        if (successCount % 100 === 0) {
          process.stdout.write(`\rExecuted: ${successCount} statements`);
        }
      } catch (err) {
        errorCount++;
        if (!err.message.includes('already exists') &&
            !err.message.includes('does not exist') &&
            !err.message.includes('duplicate key')) {
          console.error(`\n[Line ${lineNum}] Error: ${err.message}`);
        }
      }
      buffer = '';
    }
  }

  if (buffer.trim()) {
    try {
      await client.query(buffer);
      successCount++;
    } catch (err) {
      errorCount++;
      console.error(`\nFinal Error: ${err.message}`);
    }
  }

  console.log(`\n\nImport complete!`);
  console.log(`  Total statements: ${statementCount}`);
  console.log(`  Successful: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);

  await client.end();
}

const sqlFile = process.argv[2] || 'autogaard_backup_final.sql';
const sqlPath = path.join(__dirname, sqlFile);

if (!fs.existsSync(sqlPath)) {
  console.error(`Error: File not found: ${sqlPath}`);
  console.error('Usage: node import_backup_db2.js [sql-file]');
  process.exit(1);
}

console.log(`Importing: ${sqlFile}`);
console.log(`File size: ${(fs.statSync(sqlPath).size / 1024 / 1024).toFixed(2)} MB\n`);

importBackup(sqlPath).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
