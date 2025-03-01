const express = require('express');
const router = express.Router();
const summaryMid = require("../Middleware/Summary_Mid");

/**
 * @swagger
 * /summary/monthly:
 *   get:
 *     summary: Get monthly summary for all users
 *     tags: [Summary]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month in format YYYY-MM
 *     responses:
 *       200:
 *         description: Monthly summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: string
 *                       avgSystolic:
 *                         type: number
 *                       avgDiastolic:
 *                         type: number
 *                       avgPulse:
 *                         type: number
 *                       abnormalCount:
 *                         type: number
 *       500:
 *         description: Error retrieving summary
 */
router.get("/monthly", [summaryMid.GetMonthlySummary], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", data: req.summary });
    } else {
        return res.status(500).json({ message: "Error retrieving summary" });
    }
});

module.exports = router;
