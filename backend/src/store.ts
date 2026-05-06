import { promises as fs } from 'fs';
import path from 'path';
import { CreateReportInput, Report } from './types';

const dataDirectory = path.join(__dirname, '..', 'data');
const reportsFilePath = path.join(dataDirectory, 'reports.json');

async function ensureReportsFile(): Promise<void> {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(reportsFilePath);
  } catch {
    await fs.writeFile(reportsFilePath, '[]', 'utf-8');
  }
}

export function normalizeLicensePlate(licensePlate: string): string {
  return licensePlate.toUpperCase().replace(/\s+/g, '').trim();
}

async function readReports(): Promise<Report[]> {
  await ensureReportsFile();

  try {
    const fileContent = await fs.readFile(reportsFilePath, 'utf-8');

    if (!fileContent.trim()) {
      return [];
    }

    const parsed = JSON.parse(fileContent) as unknown;

    if (!Array.isArray(parsed)) {
      console.warn('reports.json did not contain an array. Resetting file.');
      await writeReports([]);
      return [];
    }

    return parsed as Report[];
  } catch (error) {
    console.warn('reports.json was empty or corrupted. Resetting file.', error);
    await writeReports([]);
    return [];
  }
}

async function writeReports(reports: Report[]): Promise<void> {
  await ensureReportsFile();
  await fs.writeFile(reportsFilePath, JSON.stringify(reports, null, 2), 'utf-8');
}

export async function createReport(input: CreateReportInput): Promise<Report> {
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
}

export async function findReportsByLicensePlate(licensePlate: string): Promise<Report[]> {
  const reports = await readReports();
  const normalizedPlate = normalizeLicensePlate(licensePlate);

  return reports.filter((report) => report.licensePlate === normalizedPlate);
}

export async function getAllReports(): Promise<Report[]> {
  return readReports();
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