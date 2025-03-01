const express = require('express');
const router = express.Router();
const measurementMid = require("../Middleware/Measurements_Mid");


router.post("/add", [measurementMid.AddMeasurement], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", Last_Id: req.insertId });
    } else {
        return res.status(500).json({ message: "Error adding measurement" });
    }
});


router.get("/history/:userId", [measurementMid.ReadMeasurements], (req, res) => {
    if (req.success) {
        res.status(200).json({
            msg: "ok",
            averageSystolic: req.averageSystolic,
            measurements: req.measurements
        });
    } else {
        return res.status(500).json({ message: "Error retrieving measurements" });
    }
});

module.exports = router;
