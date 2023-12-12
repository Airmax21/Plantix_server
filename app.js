const express = require('express');
const db = require('./db');
const mqttClient = require('./mqttHandler');
const router = require('./router');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.mqttClient = mqttClient;
  next();
});

app.use('/api', router);

process.on('SIGINT', async () => {
  try {
    await db.close();
    console.log('Database terputus');
  } catch (e) {
    console.log('Error Close Database : ', e);
  } finally {
    process.exit();
  }
})

app.listen(port, () => {
  console.log(`Port ${port}`);
});
