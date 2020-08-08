const keys = require('./keys')
const redis = require('redis')

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000, // Whenever the connection would lost, that will trigger re-connection in every 1000ms
})

// If you need to send regular commands to Redis while in subscriber mode, just open another connection with a new client (hint: use client.duplicate()).
const sub = redisClient.duplicate()

function fibonacci(n) {
  if (n < 2) return 1
  return fibonacci(n-1) + fibonacci(n-2)
}

// Whenever new values shows up in redis, we calculate the fib value and set it inside of a hash called 'values'.
sub.on('message', (channel, message) => {
  sub.hset('values', message, fibonacci(+message))
})

sub.subscribe('insert') // We will use 'insert' key-named event to trigger the code above