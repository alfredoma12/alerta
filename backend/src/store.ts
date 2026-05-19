import { db, initializeDatabase } from './db';
import { CreateReportInput, Report } from './types';

export function normalizeLicensePlate(licensePlate: string): string {
  return licensePlate.toUpperCase().replace(/\s+/g, '').trim();
}

type ReportRow = {
  id: string;

  licensePlate: string;

  brand: string | null;
  model: string | null;
  color: string | null;
  chassis: string | null;
  reward: number | null;

  description: string;
  location: string;
  contact: string | null;

  date: string;
};

function mapReportRow(row: ReportRow): Report {
  return {
    id: row.id,

    licensePlate: row.licensePlate,

    brand: row.brand ?? undefined,
    model: row.model ?? undefined,
    color: row.color ?? undefined,
    chassis: row.chassis ?? undefined,
    reward: row.reward ?? 0,

    description: row.description,
    location: row.location,
    contact: row.contact || '',

    date: row.date,
  };
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  const rewardValue =
    typeof input.reward === 'number'
      ? input.reward
      : Number(input.reward ?? 0);

  const report: Report = {
    id: crypto.randomUUID(),

    licensePlate: normalizeLicensePlate(input.licensePlate),

    brand: input.brand?.trim() || undefined,
    model: input.model?.trim() || undefined,
    color: input.color?.trim() || undefined,
    chassis: input.chassis?.trim() || undefined,
    reward: Number.isFinite(rewardValue) ? rewardValue : 0,

    description: input.description.trim(),
    location: input.location.trim(),
    contact: input.contact.trim(),

    date: input.date ? new Date(input.date).toISOString() : new Date().toISOString(),
  };

  console.log(`[db] INSERT report id=${report.id} plate=${report.licensePlate}`);

  try {

    const insert = db.prepare(`
      INSERT INTO reports (
        id,
        licensePlate,

        brand,
        model,
        color,
        chassis,
        reward,

        description,
        location,
        contact,

        date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      report.id,
      report.licensePlate,

      report.brand,
      report.model,
      report.color,
      report.chassis,
      report.reward,

      report.description,
      report.location,
      report.contact,

      report.date,
    );

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

    const query = db.prepare(`
      SELECT
        id,
        licensePlate,

        brand,
        model,
        color,
        chassis,
        reward,

        description,
        location,
        contact,

        date
      FROM reports
      WHERE licensePlate = ?
      ORDER BY date DESC
    `);

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

    const query = db.prepare(`
      SELECT
        id,
        licensePlate,

        brand,
        model,
        color,
        chassis,
        reward,

        description,
        location,
        contact,

        date
      FROM reports
      ORDER BY date DESC
    `);

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

    const queryStatement = db.prepare(`
      SELECT
        id,
        licensePlate,

        brand,
        model,
        color,
        chassis,
        reward,

        description,
        location,
        contact,

        date
      FROM reports
      WHERE licensePlate LIKE ?
         OR LOWER(description) LIKE ?
         OR LOWER(location) LIKE ?
         OR LOWER(IFNULL(brand, '')) LIKE ?
         OR LOWER(IFNULL(model, '')) LIKE ?
         OR LOWER(IFNULL(color, '')) LIKE ?
         OR LOWER(IFNULL(chassis, '')) LIKE ?
      ORDER BY date DESC
    `);

    const plateLike = `%${normalizedQuery}%`;
    const textLike = `%${lowerQuery}%`;
    const textLike2 = `%${lowerQuery}%`;
    const textLike3 = `%${lowerQuery}%`;
    const textLike4 = `%${lowerQuery}%`;

    const rows = queryStatement.all(
      plateLike,
      textLike,
      textLike,
      textLike2,
      textLike3,
      textLike4,
    ) as ReportRow[];

    return rows.map(mapReportRow);

  } catch (error) {
    console.error('[db] Failed to query reports by text search:', error);
    throw error;
  }
}

export async function initializeStore(): Promise<void> {
  initializeDatabase();
}