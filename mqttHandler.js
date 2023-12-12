const mqtt = require('mqtt');
const config = require('./config');
const db = require('./db');
const mqttClient = mqtt.connect(config.mqtt.broker);

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(config.mqtt.topic);
});

mqttClient.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
  var pesan = JSON.parse(message);
  // db.tinsert('dat_sensor',pesan.msg);
});

module.exports = mqttClient;
