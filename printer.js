const express = require('express');
const db = require('./db');
const ExcelJS = require('exceljs');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        var result = await db.query('SELECT * FROM dat_sensor WHERE is_deleted = 0 ORDER BY tgl_terima DESC');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
        worksheet.columns = [
            { header: 'Nama', key: 'name', width: 20 },
            { header: 'Usia', key: 'age', width: 10 },
            { header: 'Email', key: 'email', width: 30 }
        ];

        const data = [
            { name: 'John Doe', age: 30, email: 'john.doe@example.com' },
            { name: 'Jane Doe', age: 25, email: 'jane.doe@example.com' },
            { name: 'Bob Smith', age: 40, email: 'bob.smith@example.com' }
        ];

        worksheet.addRows(data);

        // Set header untuk response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');

        // Stream workbook ke response
        workbook.xlsx.write(res)
            .then(() => {
                res.end();
                console.log('File Excel berhasil dikirim');
            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });
    }
    catch (e) {
        console.log('Error: ', e)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    var data = req.body;
    try {
        var where = [];
        var values = [];
        where.push('is_deleted = 1');
        if (data.length == 0) {
            where.push('1=1');
        } else {
            if (data.tgl_mulai && data.tgl_akhir) {
                where.push('tlg_terima BETWEEN ? AND ?');
                values.push(data.tgl_mulai, data.tgl_akhir);
            }
            if (data.sumber) {
                where.push(`sumber LIKE '%${data.sumber}%'`);
            }
        }
        where = where.join(' AND ');
        var result = await db.query(`SELECT * FROM dat_sensor WHERE ${where}`, values);
        res.json(result);
    } catch (e) {
        console.log('Error : ', e);
        res.status(500).json({ error: 'Format filter salah' })
    }
});

router.use((req, res) => {
    res.status(404).send('404 Not Found');
});

module.exports = router;
