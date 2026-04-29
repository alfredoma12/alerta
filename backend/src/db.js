const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !databaseUrl.trim()) {
  throw new Error('Falta DATABASE_URL en variables de entorno.');
}

const shouldUseSsl = (process.env.PGSSLMODE || '').toLowerCase() !== 'disable';

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

async function initDatabase() {
  const createVehiclesTableQuery = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id BIGSERIAL PRIMARY KEY,
      patente VARCHAR(10) NOT NULL,
      marca TEXT,
      modelo TEXT,
      color TEXT,
      descripcion TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const createVehiclesPatenteIndexQuery = `
    CREATE INDEX IF NOT EXISTS idx_vehicles_patente
    ON vehicles (UPPER(patente))
  `;

  await pool.query(createVehiclesTableQuery);
  await pool.query(createVehiclesPatenteIndexQuery);
}

module.exports = {
  pool,
  initDatabase,
};
