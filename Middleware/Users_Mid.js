async function AddUser(req, res, next) {
    let user_name = addSlashes(req.body.name);
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
    let id   = parseInt(req.body.id);
    let name = addSlashes(req.body.name);
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
