const db = require("./src/config/database");

db.seedDemoMedicines();

console.log(
  "Medicine records:",
  db.prepare("SELECT COUNT(*) AS count FROM medicines").get().count
);

console.log("Demo seed completed.");
db.close();
