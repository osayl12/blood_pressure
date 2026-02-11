const express = require("express");
const router = express.Router();
const measurementMid = require("../Middleware/Measurements_Mid");

/**
 * @swagger
 * /measurements/add:
 *   post:
 *     summary: Add a new measurement
 *     tags: [Measurements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               systolic:
 *                 type: number
 *               diastolic:
 *                 type: number
 *               pulse:
 *                 type: number
 *               measurementDate:
 *                 type: string
 *                 format: date
 *             example:
 *               userId: 1
 *               systolic: 120
 *               diastolic: 80
 *               pulse: 70
 *               measurementDate: "2025-03-01"
 *     responses:
 *       200:
 *         description: Measurement added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 Last_Id:
 *                   type: number
 *       500:
 *         description: Error adding measurement
 */
router.post("/add", [measurementMid.AddMeasurement], (req, res) => {
  if (req.success) {
    res.status(200).json({ msg: "ok", Last_Id: req.insertId });
  } else {
    return res.status(500).json({ message: "Error adding measurement" });
  }
});

/**
 * @swagger
 * /measurements/history/{userId}:
 *   get:
 *     summary: Retrieve measurement history for a user
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the user
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         required: true
 *         description: Start date for measurements (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         required: true
 *         description: End date for measurements (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Measurement history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 averageSystolic:
 *                   type: number
 *                 measurements:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error retrieving measurements
 */
router.get(
  "/history/:userId",
  [measurementMid.ReadMeasurements],
  (req, res) => {
    if (req.success) {
      res.status(200).json({
        msg: "ok",
        averageSystolic: req.averageSystolic,
        measurements: req.measurements,
      });
    } else {
      return res.status(500).json({ message: "Error retrieving measurements" });
    }
  },
);

module.exports = router;
