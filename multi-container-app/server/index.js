const keys = require('./keys');
const express = require('express');
const redis = require('redis');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors()); // Cross origin resource sharing enabled
app.use(express.json()); // JSON data will be accessible from req.body 

const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	port: keys.pgPort,
	database: keys.pgDatabase,
	password: keys.pgPassword,
});

pgClient.on('error', (err) => {
	console.log('Lost Postgres connection');
});

pgClient
	.query('CREATE TABLE IF NOT EXISTS values (number INT)')
	.catch((err) => {
		console.log('Create table query failed', err);
	});

const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
});

// If you need to send regular commands to Redis while in subscriber mode, just open another connection with a new client (hint: use client.duplicate()).
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  res.send('hi')
})

// Retrieves all data on the persistend data store, Postgre
app.get('/values/all', async (req, res) => {
  const result = await pgClient.query('SELECT * from values')
  res.send(result.rows)
})

// Retrieves values that searched by the current user from in memory store, Redis
app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values)
  })
})

app.post('/values', (req, res) => {
  const value = req.body.value
  if (+value > 40) {
    res.status(422).send('Value too high')
  }

  // Will trigger the worker to do necessary Redis store events
  redisPublisher.publish('insert', value) 
  // Store searched value in persistend store
  pgClient.query('INSERT INTO values(number) VALUES=[$1]', [value])

  res.send('workin..')
})

app.listen(process.env.PORT || 8080, () => {console.log('Server is up and listening')})