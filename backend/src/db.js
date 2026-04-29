const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '..', 'database.db');
const db = new sqlite3.Database(dbPath);

function initDatabase() {
  const createVehiclesTableQuery = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patente TEXT NOT NULL,
      marca TEXT,
      modelo TEXT,
      color TEXT,
      descripcion TEXT
    )
  `;

  return new Promise((resolve, reject) => {
    db.run(createVehiclesTableQuery, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

module.exports = {
  db,
  initDatabase,
};
