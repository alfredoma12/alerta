import { promises as fs } from 'fs';
import path from 'path';
import { CreateReportInput, Report } from './types';

const dataDirectory = path.join(process.cwd(), 'data');
const reportsFilePath = path.join(dataDirectory, 'reports.json');
let storeLock: Promise<void> = Promise.resolve();

console.log(`[store] Using reports file: ${reportsFilePath}`);

async function withStoreLock<T>(operation: () => Promise<T>): Promise<T> {
  const previous = storeLock;
  let release: () => void = () => {};

  storeLock = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;

  try {
    return await operation();
  } finally {
    release();
  }
}

export function getReportsFilePath(): string {
  return reportsFilePath;
}

async function ensureReportsFile(): Promise<void> {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(reportsFilePath);
  } catch {
    await fs.writeFile(reportsFilePath, '[]', 'utf-8');
    console.log(`[store] Created missing storage file: ${reportsFilePath}`);
  }
}

export function normalizeLicensePlate(licensePlate: string): string {
  return licensePlate.toUpperCase().replace(/\s+/g, '').trim();
}

async function readReports(): Promise<Report[]> {
  await ensureReportsFile();
  console.log(`[store] Reading reports from: ${reportsFilePath}`);

  try {
    const fileContent = await fs.readFile(reportsFilePath, 'utf-8');

    if (!fileContent.trim()) {
      console.warn('[store] reports.json was empty. Falling back to []');
      return [];
    }

    const parsed = JSON.parse(fileContent) as unknown;

    if (!Array.isArray(parsed)) {
      console.warn('reports.json did not contain an array. Resetting file.');
      await writeReports([]);
      return [];
    }

    return (parsed as Partial<Report>[])
      .filter(
        (item) =>
          typeof item.id === 'string' &&
          typeof item.licensePlate === 'string' &&
          typeof item.description === 'string' &&
          typeof item.location === 'string' &&
          typeof item.contact === 'string' &&
          typeof item.date === 'string',
      )
      .map((item) => ({
        id: item.id as string,
        licensePlate: normalizeLicensePlate(item.licensePlate as string),
        description: (item.description as string).trim(),
        location: (item.location as string).trim(),
        contact: (item.contact as string).trim(),
        date: item.date as string,
      }));
  } catch (error) {
    console.warn('reports.json was empty or corrupted. Resetting file.', error);
    await writeReports([]);
    return [];
  }
}

async function writeReports(reports: Report[]): Promise<void> {
  await ensureReportsFile();
  console.log(`[store] Writing ${reports.length} reports to: ${reportsFilePath}`);
  await fs.writeFile(reportsFilePath, JSON.stringify(reports, null, 2), 'utf-8');
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  return withStoreLock(async () => {
    const reports = await readReports();

    const report: Report = {
      id: crypto.randomUUID(),
      licensePlate: normalizeLicensePlate(input.licensePlate),
      description: input.description.trim(),
      location: input.location.trim(),
      contact: input.contact.trim(),
      date: new Date().toISOString(),
    };

    reports.push(report);
    await writeReports(reports);

    return report;
  });
}

export async function findReportsByLicensePlate(licensePlate: string): Promise<Report[]> {
  const reports = await readReports();
  const normalizedPlate = normalizeLicensePlate(licensePlate);

  return reports.filter((report) => report.licensePlate === normalizedPlate);
}

export async function getAllReports(): Promise<Report[]> {
  return readReports();
}

// Backward-friendly alias used by server routes.
export async function getReports(): Promise<Report[]> {
  return getAllReports();
}

// Returns reports whose plate, description or location contains the query.
// An empty query returns every report.
export async function searchReports(query: string): Promise<Report[]> {
  const reports = await readReports();

  if (!query.trim()) {
    return reports;
  }

  const normalizedQuery = normalizeLicensePlate(query);
  const lowerQuery = query.trim().toLowerCase();

  return reports.filter(
    (r) =>
      r.licensePlate.includes(normalizedQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.location.toLowerCase().includes(lowerQuery),
  );
}

export async function initializeStore(): Promise<void> {
  await ensureReportsFile();
}