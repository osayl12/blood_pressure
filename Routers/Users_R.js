const express = require('express');
const router = express.Router();
const userMid = require("../Middleware/Users_Mid");

router.post("/create", [userMid.AddUser], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", Last_Id: req.insertId });
    } else {
        res.status(500).json({ message: "Error creating user" });
    }
});


router.get("/list", [userMid.ReadUsers], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", data: req.users_data });
    } else {
        res.status(500).json({ message: "Error retrieving users" });
    }
});


router.put("/update", [userMid.UpdateUser], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok" });
    } else {
        res.status(500).json({ message: "Error updating user" });
    }
});

router.delete("/delete", [userMid.DeleteUser], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok" });
    } else {
        res.status(500).json({ message: "Error deleting user" });
    }
});

module.exports = router;
