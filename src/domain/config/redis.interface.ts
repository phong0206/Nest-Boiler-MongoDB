export interface RedisConfig {
  getRedisHost(): string;
  getRedisPort(): number;
  getRedisPassword(): string;
  getRedisPrefix(): string;
}
