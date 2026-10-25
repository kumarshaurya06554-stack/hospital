const db = require("../config/database");

function getMedicines(req, res) {
  try {
    const medicines = db.prepare(`
      SELECT id, name, strength, pack_size, price, demo_data
      FROM medicines
      ORDER BY name
    `).all();

    res.json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error("Medicine API error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch medicines"
    });
  }
}

module.exports = { getMedicines };
