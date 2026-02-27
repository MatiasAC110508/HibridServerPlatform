const db = require('../config/db');

const getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query
        let whereClause = '';
        let params = [];

        // Date range filter if it comes in the URL
        if (startDate && endDate) {
            whereClause = 'WHERE appointment_date BETWEEN ? AND ?';
            params = [startDate, endDate];
        }

        // 1. General total  and ensurance inputs query
        const query = `
        SELECT COALESCE(i.name, 'No ensurance') AS insurance_name,
        SUM(a.amount_paid) AS total_appointments FROM appointments a
        LEFT JOIN insurances i ON a.insurance_id = i.id ${whereClause}
        GROUP BY i.name`;

        const [rows] = await db.query(query, params);

        // 2. Calculate the global total summing the results of the ensurances
        const globalTotal = rows.reduce((acc, curr) => acc + parseFloat(curr.total_revenue), 0);

        res.json({
            dateRange: {startDate, endDate},
            totalGlobalRevenue: globalTotal,
            breakdownByInsurance: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error generating the inputs report'});
    }
};

module.exports = {getRevenueReport};