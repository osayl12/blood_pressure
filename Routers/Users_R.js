const express = require('express');
const router = express.Router();
const userMid = require("../Middleware/Users_Mid");

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: "John Doe"
 *     responses:
 *       200:
 *         description: User created successfully
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
 *         description: Error creating user
 */
router.post("/create", [userMid.AddUser], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", Last_Id: req.insertId });
    } else {
        return res.status(500).json({ message: "Error creating user" });
    }
});

/**
 * @swagger
 * /users/list:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *       500:
 *         description: Error retrieving users
 */
router.get("/list", [userMid.ReadUsers], (req, res) => {
    if (req.success) {
        res.status(200).json({
            msg  : "ok",
            data : req.users_data,
        });
    } else {
        return res.status(500).json({ message: "Error retrieving users" });
    }
});

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               name:
 *                 type: string
 *             example:
 *               id: 1
 *               name: "Jane Doe"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Error updating user
 */
router.put("/update", [userMid.UpdateUser], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok" });
    } else {
        return res.status(500).json({ message: "Error updating user" });
    }
});

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *             example:
 *               id: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       500:
 *         description: Error deleting user
 */
router.delete("/delete", [userMid.DeleteUser], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok" });
    } else {
        return res.status(500).json({ message: "Error deleting user" });
    }
});

module.exports = router;
