const express = require('express');
const router = express.Router();
const summaryMid = require("../Middleware/Summary_Mid");


router.get("/monthly", [summaryMid.GetMonthlySummary], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", data: req.summary });
    } else {
        return res.status(500).json({ message: "Error retrieving summary" });
    }
});

module.exports = router;
