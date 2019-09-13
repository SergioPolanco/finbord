import redis from 'redis'
import config from '../config'

const redisConfig = config.redis
const redisClient = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port
})

redisClient.expire

export default redisClient