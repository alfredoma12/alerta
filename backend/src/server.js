require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { pool, initDatabase } = require('./db');

const app = express();
const port = Number(process.env.PORT || 3001);
const apiKey = process.env.API_KEY;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || 'https://alfredoma12.github.io')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

if (!apiKey || !apiKey.trim()) {
  throw new Error('Falta API_KEY en variables de entorno.');
}

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl/Postman) that do not send Origin.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origen no permitido por CORS.'));
    },
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.' },
  }),
);

function apiKeyMiddleware(req, res, next) {
  const incomingApiKey = (req.header('x-api-key') || '').trim();
  const expectedApiKey = (apiKey || '').trim();

  if (!incomingApiKey || incomingApiKey !== expectedApiKey) {
    res.status(403).json({ error: 'API key invalida.' });
    return;
  }

  next();
}

function validatePatente(req, res, next) {
  const patente = req.body.patente;

  if (!patente || typeof patente !== 'string' || !patente.trim()) {
    res.status(400).json({ error: 'patente es obligatoria.' });
    return;
  }

  if (patente.trim().length > 10) {
    res.status(400).json({ error: 'patente no puede superar 10 caracteres.' });
    return;
  }

  req.body.patente = patente.trim().toUpperCase();
  next();
}

app.post('/api/vehicles', apiKeyMiddleware, validatePatente, async (req, res) => {
  const { patente, marca = null, modelo = null, color = null, descripcion = null } = req.body;

  const query = `
    INSERT INTO vehicles (patente, marca, modelo, color, descripcion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  try {
    const result = await pool.query(query, [patente, marca, modelo, color, descripcion]);
    res.status(201).json({
      id: result.rows[0].id,
      patente,
      marca,
      modelo,
      color,
      descripcion,
    });
  } catch {
    res.status(500).json({ error: 'Error de base de datos al crear registro.' });
  }
});

app.get('/api/vehicles/:patente', apiKeyMiddleware, async (req, res) => {
  const patente = (req.params.patente || '').trim().toUpperCase();

  if (!patente) {
    res.status(400).json({ error: 'patente es obligatoria.' });
    return;
  }

  if (patente.length > 10) {
    res.status(400).json({ error: 'patente no puede superar 10 caracteres.' });
    return;
  }

  const query = `
    SELECT id, patente, marca, modelo, color, descripcion
    FROM vehicles
    WHERE UPPER(patente) = UPPER($1)
    ORDER BY id DESC
    LIMIT 1
  `;

  try {
    const result = await pool.query(query, [patente]);
    const row = result.rows[0];
    if (!row) {
      res.status(404).json({ error: 'Registro no encontrado.' });
      return;
    }

    res.json(row);
  } catch {
    res.status(500).json({ error: 'Error de base de datos al buscar registro.' });
  }
});

app.get('/search', apiKeyMiddleware, async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  const like = `%${q}%`;

  const query = q
    ? `
      SELECT id, patente, marca, modelo, color, descripcion, created_at
      FROM vehicles
      WHERE patente ILIKE $1
        OR COALESCE(marca, '') ILIKE $2
        OR COALESCE(modelo, '') ILIKE $3
        OR COALESCE(color, '') ILIKE $4
        OR COALESCE(descripcion, '') ILIKE $5
      ORDER BY id DESC
      LIMIT 100
    `
    : `
      SELECT id, patente, marca, modelo, color, descripcion, created_at
      FROM vehicles
      ORDER BY id DESC
      LIMIT 100
    `;

  const params = q ? [like, like, like, like, like] : [];

  try {
    const result = await pool.query(query, params);
    const items = (result.rows || []).map((row) => ({
      id: row.id,
      type: 'VEHICLE',
      name: [row.marca, row.modelo].filter(Boolean).join(' ').trim() || null,
      plate: row.patente,
      description: row.descripcion || 'Sin descripcion',
      status: 'APPROVED',
      createdAt: row.created_at || new Date().toISOString(),
      evidence: [],
    }));

    res.json({ items });
  } catch {
    res.status(500).json({ error: 'Error de base de datos al buscar registros.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
  if (error && error.message === 'Origen no permitido por CORS.') {
    res.status(403).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: 'Error interno del servidor.' });
});

async function startServer() {
  try {
    await initDatabase();

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Servidor escuchando en http://localhost:${port}`);
      // eslint-disable-next-line no-console
      console.log(`CORS permitido para: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
