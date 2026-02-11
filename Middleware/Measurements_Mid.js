async function AddMeasurement(req, res, next) {
  const { userId, systolic, diastolic, pulse, measurementDate } = req.body;

  const Query = `
    INSERT INTO measurements (user_id, systolic, diastolic, pulse, measurement_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const promisePool = global.db_pool.promise();
    const [rows] = await promisePool.execute(Query, [
      Number(userId),
      Number(systolic),
      Number(diastolic),
      Number(pulse),
      measurementDate,
    ]);
    req.success = true;
    req.insertId = rows.insertId;
  } catch (err) {
    console.error(err);
    req.success = false;
  }
  next();
}

async function ReadMeasurements(req, res, next) {
  const userId = Number(req.params.userId);
  const { start, end } = req.query;

  const Query = `
    SELECT *
    FROM measurements
    WHERE user_id = ?
      AND measurement_date BETWEEN ? AND ?
    ORDER BY measurement_date ASC
  `;

  try {
    const promisePool = global.db_pool.promise();
    const [rows] = await promisePool.execute(Query, [userId, start, end]);

    if (rows.length === 0) {
      req.success = true;
      req.averageSystolic = 0;
      req.measurements = [];
      return next();
    }

    const totalSystolic = rows.reduce((acc, row) => acc + row.systolic, 0);
    const avgSystolic = totalSystolic / rows.length;

    req.success = true;
    req.averageSystolic = avgSystolic;
    req.measurements = rows.map((m) => ({
      ...m,
      abnormal: m.systolic > avgSystolic * 1.2,
    }));
  } catch (err) {
    console.error(err);
    req.success = false;
  }
  next();
}

module.exports = {
  AddMeasurement,
  ReadMeasurements,
};
