// Middleware/Users_Mid.js

async function AddUser(req, res, next) {
    let user_name = req.body.name;
    const Query = `INSERT INTO users (name) VALUES('${user_name}')`;
    const promisePool = global.db_pool.promise();
    try {
        const [rows] = await promisePool.query(Query);
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
        const [rows] = await promisePool.query(Query);
        // Ensure safe HTML output
        for (let idx in rows) {
            rows[idx].name = htmlspecialchars(rows[idx].name);
        }
        req.success = true;
        req.users_data = rows;
    } catch (err) {
        console.error(err);
        req.success = false;
    }
    next();
}

async function UpdateUser(req, res, next) {
    const { id, name } = req.body;
    const Query = `UPDATE users SET name='${name}' WHERE id=${id}`;
    const promisePool = global.db_pool.promise();
    try {
        await promisePool.query(Query);
        req.success = true;
    } catch (err) {
        console.error(err);
        req.success = false;
    }
    next();
}

async function DeleteUser(req, res, next) {
    const { id } = req.body;
    const Query = `DELETE FROM users WHERE id=${id}`;
    const promisePool = global.db_pool.promise();
    try {
        await promisePool.query(Query);
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
