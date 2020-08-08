module.exports = {
  redisHost: process.env.REDIS_HOST, // Redis related configurations
  redisPort: process.env.REDIS_PORT,
  pgUser: process.env.PG_USER, // Postgre SQL related configurations
  pgHost: process.env.PG_HOST,
  pgPort: process.env.PG_PORT,
  pgDatabase: process.env.PG_DATABASE,
  pgPassword: process.env.PG_PASSWORD,
}