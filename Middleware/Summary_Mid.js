async function GetMonthlySummary(req, res, next) {
  let month = req.query.month;
  if (!month) {
    req.success = false;
    return next();
  }
  let startDate = `${month}-01`;
  let dateObj = new Date(startDate);
  dateObj.setMonth(dateObj.getMonth() + 1);
  dateObj.setDate(dateObj.getDate() - 1);
  let endDate = dateObj.toISOString().split("T")[0];

  const promisePool = global.db_pool.promise();
  try {
    const [users] = await promisePool.query(`SELECT * FROM users`);
    let summary = await Promise.all(
      users.map(async (user) => {
        const [measurements] = await promisePool.query(
          `SELECT * FROM measurements WHERE user_id = ${user.id} AND measurement_date BETWEEN '${startDate}' AND '${endDate}'`,
        );
        if (measurements.length === 0) {
          return {
            user: user.name,
            avgSystolic: null,
            avgDiastolic: null,
            avgPulse: null,
            abnormalCount: 0,
          };
        }
        let count = measurements.length;
        let totalSystolic = measurements.reduce(
          (acc, m) => acc + m.systolic,
          0,
        );
        let totalDiastolic = measurements.reduce(
          (acc, m) => acc + m.diastolic,
          0,
        );
        let totalPulse = measurements.reduce((acc, m) => acc + m.pulse, 0);
        let avgSystolic = totalSystolic / count;
        let avgDiastolic = totalDiastolic / count;
        let avgPulse = totalPulse / count;
        let abnormalCount = measurements.filter(
          (m) => m.systolic > avgSystolic * 1.2,
        ).length;
        return {
          user: user.name,
          avgSystolic,
          avgDiastolic,
          avgPulse,
          abnormalCount,
        };
      }),
    );
    req.success = true;
    req.summary = summary;
  } catch (err) {
    console.error(err);
    req.success = false;
  }
  next();
}

module.exports = {
  GetMonthlySummary,
};
