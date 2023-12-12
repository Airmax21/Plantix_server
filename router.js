const express = require('express');
const db = require('./db');
const config = require('./config');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        var result = await db.query('SELECT * FROM dat_sensor WHERE is_deleted = 0 ORDER BY tgl_terima DESC LIMIT 1');
        res.json(result);
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

router.get('/publish/:topic/:message', (req, res) => {
    const { topic, message } = req.params;
    req.mqttClient.publish(topic, message);
    res.send(`Published to topic ${topic}: ${message}`);
});

router.post('/publish', (req, res) => {
    const data = req.body;
    req.mqttClient.publish('tes', JSON.stringify(data));
    console.log('Data yang diterima:', data);
    res.status(200).json({ message: 'Data berhasil diterima!' });
});

router.use((req, res) => {
    res.status(404).send('404 Not Found');
});

module.exports = router;
