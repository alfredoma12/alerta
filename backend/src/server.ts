import cors from 'cors';
import express, { Request, Response } from 'express';
import {
  createReport,
  findReportsByLicensePlate,
  getAllReports,
  initializeStore,
  normalizeLicensePlate,
} from './store';
import { AlertInput, CreateReportInput } from './types';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Allow frontend requests from any origin for now.
app.use(cors());
app.use(express.json());

// Log each incoming request to keep local debugging simple.
app.use((req: Request, _res: Response, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

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

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Stolen car backend is running.' });
});

app.get('/reports', async (_req: Request, res: Response) => {
  try {
    const reports = await getAllReports();
    res.json(reports);
  } catch (error) {
    console.error('Failed to load all reports:', error);
    res.status(500).json({ error: 'Could not load reports.' });
  }
});

app.post('/reports', async (req: Request, res: Response) => {
  const { licensePlate, description, location, contact } = req.body as Partial<CreateReportInput>;

  const licensePlateResult = getRequiredString(licensePlate, 'licensePlate');
  if (!licensePlateResult.ok) {
    res.status(400).json({ error: licensePlateResult.message });
    return;
  }

  const descriptionResult = getRequiredString(description, 'description');
  if (!descriptionResult.ok) {
    res.status(400).json({ error: descriptionResult.message });
    return;
  }

  const locationResult = getRequiredString(location, 'location');
  if (!locationResult.ok) {
    res.status(400).json({ error: locationResult.message });
    return;
  }

  const contactResult = getRequiredString(contact, 'contact');
  if (!contactResult.ok) {
    res.status(400).json({ error: contactResult.message });
    return;
  }

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

app.get('/reports/:licensePlate', async (req: Request, res: Response) => {
  const rawLicensePlate = req.params.licensePlate;
  const licensePlate = Array.isArray(rawLicensePlate) ? rawLicensePlate[0] : rawLicensePlate;

  const licensePlateResult = getRequiredString(licensePlate, 'licensePlate');
  if (!licensePlateResult.ok) {
    res.status(400).json({ error: licensePlateResult.message });
    return;
  }

  try {
    const reports = await findReportsByLicensePlate(licensePlateResult.value);
    res.json(reports);
  } catch (error) {
    console.error('Failed to search reports:', error);
    res.status(500).json({ error: 'Could not load reports.' });
  }
});

app.post('/alerts', async (req: Request, res: Response) => {
  const { licensePlate, seenLocation } = req.body as Partial<AlertInput>;

  const licensePlateResult = getRequiredString(licensePlate, 'licensePlate');
  if (!licensePlateResult.ok) {
    res.status(400).json({ error: licensePlateResult.message });
    return;
  }

  const seenLocationResult = getRequiredString(seenLocation, 'seenLocation');
  if (!seenLocationResult.ok) {
    res.status(400).json({ error: seenLocationResult.message });
    return;
  }

  try {
    const matchingReports = await findReportsByLicensePlate(licensePlateResult.value);

    if (matchingReports.length === 0) {
      res.json({
        message: `No report found for plate ${normalizeLicensePlate(licensePlateResult.value)}.`,
      });
      return;
    }

    console.log(
      `ALERT: stolen car spotted | plate=${normalizeLicensePlate(licensePlateResult.value)} | seenLocation=${seenLocationResult.value} | matches=${matchingReports.length}`,
    );

    res.json({
      message: 'Alert simulated successfully.',
      licensePlate: normalizeLicensePlate(licensePlateResult.value),
      seenLocation: seenLocationResult.value,
      matchesFound: matchingReports.length,
      reports: matchingReports,
    });
  } catch (error) {
    console.error('Failed to trigger alert:', error);
    res.status(500).json({ error: 'Could not trigger alert.' });
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found.' });
});

async function startServer(): Promise<void> {
  await initializeStore();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});