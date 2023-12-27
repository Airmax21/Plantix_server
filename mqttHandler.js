const mqtt = require('mqtt');
const config = require('./config');
const db = require('./db');
const mqttClient = mqtt.connect(config.mqtt.broker);

mqttClient.on('connect', () => {
  console.log('Terhubung dengan MQTT Broker');
  config.mqtt.topic.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      } else {
        console.error(`Failed to subscribe to ${topic}: ${err}`);
      }
    });
  });
});

mqttClient.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
  var pesan = JSON.parse(message);
  console.log(pesan);
  db.tinsert('dat_sensor',pesan.msg);
  db.tinsert('log_transaksi',message);
});

module.exports = mqttClient;
