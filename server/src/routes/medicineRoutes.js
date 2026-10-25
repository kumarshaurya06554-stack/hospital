const express = require("express");
const { getMedicines } = require("../controllers/medicineController");

const router = express.Router();

router.get("/", getMedicines);

module.exports = router;
