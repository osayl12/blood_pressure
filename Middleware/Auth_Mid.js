const crypto = require("crypto");

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal length so the response time doesn't
    // leak the correct password's length.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated === true) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

function login(req, res) {
  const password = req.body && req.body.password;
  const expected = process.env.APP_PASSWORD;

  if (!expected) {
    console.error("APP_PASSWORD is not set; refusing all logins.");
    return res.status(500).json({ error: "Server is not configured for login" });
  }

  if (!password || typeof password !== "string" || !timingSafeEqual(password, expected)) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  req.session.regenerate((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Could not start session" });
    }
    req.session.authenticated = true;
    res.status(200).json({ msg: "ok" });
  });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ msg: "ok" });
  });
}

function status(req, res) {
  res.status(200).json({ authenticated: !!(req.session && req.session.authenticated) });
}

module.exports = {
  requireAuth,
  login,
  logout,
  status,
};
