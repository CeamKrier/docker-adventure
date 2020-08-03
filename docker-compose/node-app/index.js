const express = require('express');
const redis = require('redis');

const app = express();
const storeClient = redis.createClient({
	host: 'redis-app',
	port: 6379,
});

storeClient.set('visitor', 0);

app.get('/', (req, res) => {
	storeClient.get('visitor', (err, visitorCount) => {
		res.send('Total count of visitors: ' + visitorCount);
		storeClient.set('visitor', +visitorCount + 1);
	});
});

app.listen(8080, () => {
	console.log('Listening on the port 8080');
});
