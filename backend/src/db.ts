import Database from 'better-sqlite3';
import path from 'path';

const databaseFilePath = path.join(
  __dirname,
  '..',
  'data.db',
);

export const db = new Database(databaseFilePath);

export function getDatabaseFilePath(): string {
  return databaseFilePath;
}

function getReportColumns(): string[] {
  const stmt = db.prepare(`PRAGMA table_info(reports)`)
  const rows = stmt.all() as Array<{ name: string }>
  return rows.map((row) => row.name)
}

function addReportColumn(columnName: string, columnDefinition: string): void {
  db.exec(`ALTER TABLE reports ADD COLUMN ${columnName} ${columnDefinition}`)
}

export function initializeDatabase(): void {

  try {

    console.log(
      `[db] Using SQLite file: ${databaseFilePath}`,
    );

    db.pragma('journal_mode = WAL');

    db.exec(`
      CREATE TABLE IF NOT EXISTS reports (

        id TEXT PRIMARY KEY,

        licensePlate TEXT NOT NULL,

        brand TEXT,
        model TEXT,
        color TEXT,
        chassis TEXT,
        reward REAL DEFAULT 0,

        description TEXT NOT NULL,
        location TEXT NOT NULL,
        contact TEXT,

        date TEXT NOT NULL
      )
    `);

    const existingColumns = getReportColumns();

    if (!existingColumns.includes('brand')) {
      addReportColumn('brand', 'TEXT')
    }

    if (!existingColumns.includes('model')) {
      addReportColumn('model', 'TEXT')
    }

    if (!existingColumns.includes('color')) {
      addReportColumn('color', 'TEXT')
    }

    if (!existingColumns.includes('chassis')) {
      addReportColumn('chassis', 'TEXT')
    }

    if (!existingColumns.includes('reward')) {
      addReportColumn('reward', 'REAL DEFAULT 0')
    }

    console.log('[db] reports table is ready');

  } catch (error) {

    console.error(
      '[db] Failed to initialize database:',
      error,
    );

    throw error;
  }
}