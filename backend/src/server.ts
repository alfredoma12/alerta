import cors from 'cors';
import express, { Request, Response } from 'express';
import {
  createReport,
  findReportsByLicensePlate,
  getAllReports,
  getReportByPlate,
  initializeStore,
  normalizeLicensePlate,
  searchReports,
} from './store';
import { getDatabaseFilePath } from './db';
import { AlertInput, CreateReportInput } from './types';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Allow frontend requests from any origin.
app.use(cors());
app.use(express.json());

// Log every incoming request for easier debugging.
app.use((req: Request, _res: Response, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Helper: validates that a value is a non-empty string.
function getRequiredString(
  value: unknown,
  fieldName: string,
): { ok: true; value: string } | { ok: false; message: string } {
  if (typeof value !== 'string' || !value.trim()) {
    return {
      ok: false,
      message: `${fieldName} is required and must be a non-empty string.`,
    };
  }
  return { ok: true, value: value.trim() };
}

async function handlePlateLookup(rawValue: unknown, fieldName: string, res: Response): Promise<void> {
  const plateValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  const result = getRequiredString(plateValue, fieldName);

  if (!result.ok) {
    res.status(400).json({ error: result.message });
    return;
  }

  try {
    const reports = await getReportByPlate(result.value);
    res.json(reports);
  } catch (error) {
    console.error('Failed to search reports:', error);
    res.status(500).json({ error: 'Could not load reports.' });
  }
}

async function handleAlertRequest(req: Request, res: Response): Promise<void> {
  const { licensePlate, seenLocation } = req.body as Partial<AlertInput>;

  const plateResult = getRequiredString(licensePlate, 'licensePlate');
  if (!plateResult.ok) {
    res.status(400).json({ error: plateResult.message });
    return;
  }

  const locationResult = getRequiredString(seenLocation, 'seenLocation');
  if (!locationResult.ok) {
    res.status(400).json({ error: locationResult.message });
    return;
  }

  try {
    const matchingReports = await getReportByPlate(plateResult.value);

    if (matchingReports.length === 0) {
      res.json({ message: `No report found for plate ${normalizeLicensePlate(plateResult.value)}.` });
      return;
    }

    console.log(
      `ALERT: stolen car spotted | plate=${normalizeLicensePlate(plateResult.value)} | seenLocation=${locationResult.value} | matches=${matchingReports.length}`,
    );

    res.json({
      message: 'Alert simulated successfully.',
      licensePlate: normalizeLicensePlate(plateResult.value),
      seenLocation: locationResult.value,
      matchesFound: matchingReports.length,
      reports: matchingReports,
    });
  } catch (error) {
    console.error('Failed to trigger alert:', error);
    res.status(500).json({ error: 'Could not trigger alert.' });
  }
}

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/test', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'test route working' });
});

// ─── GET /search?q=ABC123 ──────────────────────────────────────────────────────
// Called by the frontend to populate the report list.
// Returns { items: [...] } in the shape the frontend mapApiReport function expects.
app.get('/search', async (req: Request, res: Response) => {
  const rawPlate = req.query.plate;

  // Primary mode: ?plate=ABC123
  if (typeof rawPlate !== 'undefined') {
    if (typeof rawPlate !== 'string' || !rawPlate.trim()) {
      res.status(400).json({ error: 'plate is required and must be a non-empty string.' });
      return;
    }

    const normalizedPlate = normalizeLicensePlate(rawPlate);
    console.log(`[search] plate="${normalizedPlate}"`);

    try {
      const matches = await getReportByPlate(rawPlate);

      if (matches.length === 0) {
        res.status(404).json({ error: `No report found for plate ${normalizedPlate}.` });
        return;
      }

      // Return one report for direct plate lookup.
      res.json(matches[0]);
      return;
    } catch (error) {
      console.error('Failed to search by plate:', error);
      res.status(500).json({ error: 'Could not search reports.' });
      return;
    }
  }

  // Compatibility mode: ?q=... or no query, returning { items: [...] }.
  const rawQuery = typeof req.query.q === 'string' ? req.query.q : '';
  console.log(`[search] q="${rawQuery}"`);

  try {
    const reports = await searchReports(rawQuery);
    const items = reports.map((r, index) => ({
      id: index + 1,
      licensePlate: r.licensePlate,
      description: r.description,
      location: r.location,
      contact: r.contact,
      date: r.date,
    }));
    res.json({ items });
  } catch (error) {
    console.error('Failed to search reports:', error);
    res.status(500).json({ error: 'Could not search reports.' });
  }
});

// ─── GET /reports ─────────────────────────────────────────────────────────────

app.get('/reports', async (_req: Request, res: Response) => {
  try {
    const reports = await getAllReports();
    res.json(reports);
  } catch (error) {
    console.error('Failed to load all reports:', error);
    res.status(500).json({ error: 'Could not load reports.' });
  }
});

// ─── POST /reports ────────────────────────────────────────────────────────────

app.post('/reports', async (req: Request, res: Response) => {
  const { licensePlate, description, location, contact } = req.body as Partial<CreateReportInput>;

  const licensePlateResult = getRequiredString(licensePlate, 'licensePlate');
  if (!licensePlateResult.ok) {
    res.status(400).json({ error: licensePlateResult.message });
    return;
  }

  const descriptionResult = getRequiredString(description, 'description');
  if (!descriptionResult.ok) { res.status(400).json({ error: descriptionResult.message }); return; }

  const locationResult = getRequiredString(location, 'location');
  if (!locationResult.ok) { res.status(400).json({ error: locationResult.message }); return; }

  const contactResult = getRequiredString(contact, 'contact');
  if (!contactResult.ok) { res.status(400).json({ error: contactResult.message }); return; }

  try {
    const report = await createReport({
      licensePlate: licensePlateResult.value,
      description: descriptionResult.value,
      location: locationResult.value,
      contact: contactResult.value,
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Failed to create report:', error);
    res.status(500).json({ error: 'Could not save the report.' });
  }
});

// ─── GET /reports/:licensePlate ───────────────────────────────────────────────

app.get('/reports/:licensePlate', async (req: Request, res: Response) => {
  await handlePlateLookup(req.params.licensePlate, 'licensePlate', res);
});

// Compatibility alias for consumers using the Spanish path segment.
app.get('/reports/matricula/:matricula', async (req: Request, res: Response) => {
  await handlePlateLookup(req.params.matricula, 'matricula', res);
});

// ─── POST /alerts ─────────────────────────────────────────────────────────────

app.post('/alerts', async (req: Request, res: Response) => {
  await handleAlertRequest(req, res);
});

// Compatibility alias: same behavior as /alerts
app.post('/alertas', async (req: Request, res: Response) => {
  await handleAlertRequest(req, res);
});

// ─── 404 catch-all ────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Start server ─────────────────────────────────────────────────────────────

async function startServer(): Promise<void> {
  await initializeStore();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`[db] Active SQLite file: ${getDatabaseFilePath()}`);
    console.log('Routes: GET / | GET /test | GET /search | GET /reports | POST /reports | GET /reports/:licensePlate | GET /reports/matricula/:matricula | POST /alerts | POST /alertas');
  });
}

startServer().catch((error) => { console.error('Failed to start server:', error); process.exit(1); });