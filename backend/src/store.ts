import { db, initializeDatabase } from './db';
import { CreateReportInput, Report } from './types';

export function normalizeLicensePlate(licensePlate: string): string {
  return licensePlate.toUpperCase().replace(/\s+/g, '').trim();
}

type ReportRow = {
  id: string;
  licensePlate: string;
  description: string;
  location: string;
  contact: string | null;
  date: string;
};

function mapReportRow(row: ReportRow): Report {
  return {
    id: row.id,
    licensePlate: row.licensePlate,
    description: row.description,
    location: row.location,
    contact: row.contact || '',
    date: row.date,
  };
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  const report: Report = {
    id: crypto.randomUUID(),
    licensePlate: normalizeLicensePlate(input.licensePlate),
    description: input.description.trim(),
    location: input.location.trim(),
    contact: input.contact.trim(),
    date: new Date().toISOString(),
  };

  console.log(`[db] INSERT report id=${report.id} plate=${report.licensePlate}`);

  try {
    const insert = db.prepare(
      `
        INSERT INTO reports (id, licensePlate, description, location, contact, date)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
    );

    insert.run(report.id, report.licensePlate, report.description, report.location, report.contact, report.date);
    return report;
  } catch (error) {
    console.error('[db] Failed to insert report:', error);
    throw error;
  }
}

export async function getReportByPlate(licensePlate: string): Promise<Report[]> {
  const normalizedPlate = normalizeLicensePlate(licensePlate);
  console.log(`[db] SELECT reports by plate=${normalizedPlate}`);

  try {
    const query = db.prepare(
      `
        SELECT id, licensePlate, description, location, contact, date
        FROM reports
        WHERE licensePlate = ?
        ORDER BY date DESC
      `,
    );

    const rows = query.all(normalizedPlate) as ReportRow[];
    return rows.map(mapReportRow);
  } catch (error) {
    console.error('[db] Failed to query reports by plate:', error);
    throw error;
  }
}

export async function getAllReports(): Promise<Report[]> {
  console.log('[db] SELECT all reports');

  try {
    const query = db.prepare(
      `
        SELECT id, licensePlate, description, location, contact, date
        FROM reports
        ORDER BY date DESC
      `,
    );

    const rows = query.all() as ReportRow[];
    return rows.map(mapReportRow);
  } catch (error) {
    console.error('[db] Failed to query all reports:', error);
    throw error;
  }
}

// Returns reports whose plate, description or location contains the query.
// An empty query returns every report.
export async function searchReports(query: string): Promise<Report[]> {
  if (!query.trim()) {
    return getAllReports();
  }

  const normalizedQuery = normalizeLicensePlate(query);
  const lowerQuery = query.trim().toLowerCase();

  console.log(`[db] SELECT reports by search query="${query}"`);

  try {
    const queryStatement = db.prepare(
      `
        SELECT id, licensePlate, description, location, contact, date
        FROM reports
        WHERE licensePlate LIKE ?
           OR LOWER(description) LIKE ?
           OR LOWER(location) LIKE ?
        ORDER BY date DESC
      `,
    );

    const plateLike = `%${normalizedQuery}%`;
    const textLike = `%${lowerQuery}%`;
    const rows = queryStatement.all(plateLike, textLike, textLike) as ReportRow[];
    return rows.map(mapReportRow);
  } catch (error) {
    console.error('[db] Failed to query reports by text search:', error);
    throw error;
  }
}

export async function initializeStore(): Promise<void> {
  initializeDatabase();
}