import { Service, Inject, Container } from 'typedi'
import { promisify } from 'util'

@Service()
export default class SessionService {
    constructor(
        @Inject('logger') private logger,
        @Inject('redis') private redis,
    ) {
    }

    public save(token: String, userId: String): void {
        this.logger.debug('Saving session')
        this.redis.set(userId, token)
        this.redis.expire(userId, 60);
    }

    public async keyExists(key: String): Promise<Boolean> {
        const getAsync = promisify(this.redis.get).bind(this.redis)
        const value = await getAsync(key)
        return Boolean(value)
    }

    public destroy(key: String): void {
        this.logger.debug('Destroying session')
        this.redis.del(key)
    }
}