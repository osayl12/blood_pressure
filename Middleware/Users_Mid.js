function normalizeName(rawName) {
  if (typeof rawName !== "string") return null;
  const name = rawName.trim();
  if (!name || name.length > 100) return null;
  return name;
}

async function AddUser(req, res, next) {
  let user_name = normalizeName(req.body.name);
  if (!user_name) {
    req.success = false;
    return next();
  }
  const Query = `INSERT INTO users (name) VALUES(?)`;
  const promisePool = global.db_pool.promise();
  try {
    const [rows] = await promisePool.execute(Query, [user_name]);
    req.success = true;
    req.insertId = rows.insertId;
  } catch (err) {
    console.error(err);
    req.success = false;
  }
  next();
}

async function ReadUsers(req, res, next) {
  const Query = `SELECT * FROM users`;
  const promisePool = global.db_pool.promise();
  try {
    const [rows] = await promisePool.execute(Query);
    req.success = true;
    req.users_data = rows;
  } catch (err) {
    console.error(err);
    req.success = false;
  }
  next();
}

async function UpdateUser(req, res, next) {
  let id = parseInt(req.body.id);
  let name = normalizeName(req.body.name);
  if (!id || isNaN(id) || !name) {
    req.success = false;
    return next();
  }
  const Query = `UPDATE users SET name = ? WHERE id = ?`;
  const promisePool = global.db_pool.promise();
  try {
    await promisePool.execute(Query, [name, id]);
    req.success = true;
  } catch (err) {
    console.error(err);
    req.success = false;
  }
  next();
}

async function DeleteUser(req, res, next) {
  let id = parseInt(req.body.id);
  if (!id || isNaN(id)) {
    req.success = false;
    return next();
  }
  const Query = `DELETE FROM users WHERE id = ?`;
  const promisePool = global.db_pool.promise();
  try {
    await promisePool.execute(Query, [id]);
    req.success = true;
  } catch (err) {
    console.error(err);
    req.success = false;
  }
  next();
}

module.exports = {
  AddUser,
  ReadUsers,
  UpdateUser,
  DeleteUser,
};
