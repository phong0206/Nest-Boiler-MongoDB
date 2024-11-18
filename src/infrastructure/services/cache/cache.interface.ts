export abstract class ICacheService {
  /**
   * Save data to cache
   * @param key key value
   * @param value value
   * @param expired expiration
   * @return Promise<'OK'>
   * @example this.redisService.set('foo', 'bar', 60);
   */
  abstract set(key: string, value: string, expired: string | number): Promise<'OK'>;
  /**
   * Save data to cache(never exprie)
   * @param key key value
   * @param value value
   * @return Promise<number>
   * @example this.redisService.setNx('foo', 'bar');
   */
  abstract setNx(key: string, value: string): Promise<number>;
  /**
   * Get data from cache
   * @param key key value
   * @return Promise<string | null>
   * @example this.redisService.get('foo'); //'bar'
   */
  abstract get(key: string): Promise<string | null>;
  /**
   * Remove data from cache
   * @param key key value
   * @return Promise<number>
   * @example this.redisService.del('foo');
   */
  abstract del(key: string): Promise<number>;
  /**
   * Get all data with the same key from cache
   * @param prefix key
   * @return Promise<string[]>
   * @example this.redisService.keys('foo');
   */
  abstract keys(prefix: string): Promise<string[]>;
}
