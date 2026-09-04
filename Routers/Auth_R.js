const express = require("express");
const router = express.Router();
const authMid = require("../Middleware/Auth_Mid");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Sign in with the shared app password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signed in
 *       401:
 *         description: Incorrect password
 */
router.post("/login", authMid.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Sign out and destroy the session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Signed out
 */
router.post("/logout", authMid.logout);

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Check whether the current session is signed in
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Session status
 */
router.get("/status", authMid.status);

module.exports = router;
