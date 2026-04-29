require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { db, initDatabase } = require('./db');

const app = express();
const port = Number(process.env.PORT || 3001);
const apiKey = process.env.API_KEY;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://TU_USUARIO.github.io';

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

      if (origin === allowedOrigin) {
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
  const incomingApiKey = req.header('x-api-key');

  if (incomingApiKey !== apiKey) {
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

  req.body.patente = patente.trim();
  next();
}

app.post('/api/vehicles', apiKeyMiddleware, validatePatente, (req, res) => {
  const { patente, marca = null, modelo = null, color = null, descripcion = null } = req.body;

  const query = `
    INSERT INTO vehicles (patente, marca, modelo, color, descripcion)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [patente, marca, modelo, color, descripcion], function onInsert(error) {
    if (error) {
      res.status(500).json({ error: 'Error de base de datos al crear registro.' });
      return;
    }

    res.status(201).json({
      id: this.lastID,
      patente,
      marca,
      modelo,
      color,
      descripcion,
    });
  });
});

app.get('/api/vehicles/:patente', apiKeyMiddleware, (req, res) => {
  const patente = (req.params.patente || '').trim();

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
    WHERE patente = ?
    ORDER BY id DESC
    LIMIT 1
  `;

  db.get(query, [patente], (error, row) => {
    if (error) {
      res.status(500).json({ error: 'Error de base de datos al buscar registro.' });
      return;
    }

    if (!row) {
      res.status(404).json({ error: 'Registro no encontrado.' });
      return;
    }

    res.json(row);
  });
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
      console.log(`CORS permitido para: ${allowedOrigin}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
