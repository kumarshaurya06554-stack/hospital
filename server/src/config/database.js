const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../../data");
const dbPath = path.join(dataDir, "medkhoj.db");
const schemaPath = path.join(__dirname, "../../../database/schema.sql");

fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(schemaPath)) {
  throw new Error("Database schema not found: " + schemaPath);
}

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");
db.exec(fs.readFileSync(schemaPath, "utf8"));

// Demo catalogue so a fresh deployment is not empty.
const DEMO_MEDICINES = [
  ["Paracetamol", "500 mg", "10 tablets", 20],
  ["Cetirizine", "10 mg", "10 tablets", 25],
  ["Vitamin C", "500 mg", "10 tablets", 35],
  ["ORS", "Standard sachet", "1 sachet", 20],
  ["Antacid", "Demo entry", "10 tablets", 30]
];

function seedDemoMedicines() {
  const insert = db.prepare(`
    INSERT INTO medicines (name, strength, pack_size, price, demo_data)
    VALUES (?, ?, ?, ?, 1)
  `);

  const seed = db.transaction(() => {
    const existing = db.prepare("SELECT COUNT(*) AS count FROM medicines").get().count;
    if (existing === 0) {
      for (const medicine of DEMO_MEDICINES) {
        insert.run(...medicine);
      }
    }
  });

  seed();
}

seedDemoMedicines();

module.exports = db;
module.exports.seedDemoMedicines = seedDemoMedicines;
