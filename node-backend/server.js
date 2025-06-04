const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
const config = require('./config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  port: config.port
});

app.get('/', (req, res) => {
  res.send('API running');
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    app.listen(3000, () => console.log('Server running on 3000'));
  } catch (err) {
    console.error('Unable to connect to database', err);
  }
};

start();
