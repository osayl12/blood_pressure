async function AddMeasurement(req, res, next) {
    let { userId, systolic, diastolic, pulse, measurementDate } = req.body;
    const Query = `INSERT INTO measurements (user_id, systolic, diastolic, pulse, measurement_date) VALUES (${userId}, ${systolic}, ${diastolic}, ${pulse}, '${measurementDate}')`;
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

async function ReadMeasurements(req, res, next) {
    let userId = req.params.userId;
    let start = req.query.start;
    let end = req.query.end;
    const Query = `SELECT * FROM measurements WHERE user_id = ${userId} AND measurement_date BETWEEN '${start}' AND '${end}' ORDER BY measurement_date ASC`;
    const promisePool = global.db_pool.promise();
    try {
        const [rows] = await promisePool.query(Query);
        if (rows.length === 0) {
            req.success = true;
            req.averageSystolic = 0;
            req.measurements = [];
            return next();
        }
        let totalSystolic = rows.reduce((acc, row) => acc + row.systolic, 0);
        let avgSystolic = totalSystolic / rows.length;
        let measurements = rows.map(m => {
            let abnormal = m.systolic > avgSystolic * 1.2;
            return { ...m, abnormal: abnormal };
        });
        req.success = true;
        req.averageSystolic = avgSystolic;
        req.measurements = measurements;
    } catch (err) {
        console.error(err);
        req.success = false;
    }
    next();
}

module.exports = {
    AddMeasurement,
    ReadMeasurements
};
