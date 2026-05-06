import Database from 'better-sqlite3';
import path from 'path';

const databaseFilePath = path.join(process.cwd(), 'data.db');

export const db = new Database(databaseFilePath);

export function getDatabaseFilePath(): string {
  return databaseFilePath;
}

export function initializeDatabase(): void {
  try {
    console.log(`[db] Using SQLite file: ${databaseFilePath}`);

    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        licensePlate TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        contact TEXT,
        date TEXT NOT NULL
      )
    `);

    console.log('[db] reports table is ready');
  } catch (error) {
    console.error('[db] Failed to initialize database:', error);
    throw error;
  }
}
