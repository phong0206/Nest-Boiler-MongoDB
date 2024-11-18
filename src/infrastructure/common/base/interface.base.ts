import { Aggregate, AggregateOptions, FilterQuery, PipelineStage, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { BaseModel } from './base.model';

/**
 * @template T Data type of the record
 */
export abstract class AbstractBaseService<T extends BaseModel> {
  /**
   * Create a record
   * @param data Data to create the record
   * @returns Promise<T>
   * @example service.create({ name: 'John Doe' })
   */
  abstract create(data: Partial<T>): Promise<T>;

  /**
   * Create multiple records
   * @param data Data to create records
   * @returns Promise<T[]>
   * @example service.createMany([{ name: 'John Doe' }, { name: 'Jane Doe' }])
   */
  abstract createMany(data: Partial<T>[]): Promise<T[]>;

  /**
   * Get a single record
   * @param options Options to retrieve the record
   * @returns Promise<T | null>
   * @example service.getOne({ where: { name: 'John Doe' } })
   */
  abstract getOne(options: FindOptions<T>): Promise<T | null>;

  /**
   * Get a single record, throws NotFound error if not found
   * @param options Options to retrieve the record
   * @returns Promise<T>
   * @example service.getOneOrFail({ where: { name: 'John Doe' } })
   */
  abstract getOneOrFail(options: FindOrFailOptions<T>): Promise<T>;

  /**
   * Get a record by ID
   * @param id Record ID
   * @param options Options to retrieve the record
   * @returns Promise<T | null>
   * @example service.getOneById('uuid', { where: { name: 'John Doe' } })
   */
  abstract getOneById(id: string, options?: Partial<FindOptions<T>>): Promise<T | null>;

  /**
   * Get a record by ID, throws NotFound error if not found
   * @param id Record ID
   * @param options Options to retrieve the record
   * @returns Promise<T>
   * @example service.getOneByIdOrFail('uuid', { where: { name: 'John Doe' } })
   */
  abstract getOneByIdOrFail(id: string, options?: Partial<FindOrFailOptions<T>>): Promise<T>;

  /**
   * Get all records
   * @param options Options to retrieve the records
   * @returns Promise<T[]>
   * @example service.getAll({ where: { name: 'John Doe' } })
   */
  abstract getAll(options?: Partial<FindOptions<T>>): Promise<T[]>;

  /**
   * Get all records with pagination
   * @param options Options to retrieve the records
   * @returns Promise<IPaginationResponse<T>>
   * @example service.getAllPaginated({ where: { name: 'John Doe' }, limit: '10', page: '1' })
   */
  abstract getAllPaginated(options?: FindPaginatedOptions<T>): Promise<IPaginationResponse<T>>;

  /**
   * Update a record, throws NotFound error if not found
   * @param options Options to retrieve the record
   * @param data Data to update the record
   * @returns Promise<T>
   * @example service.update({ where: { name: 'John Doe' } }, { name: 'Jane Doe updated' })
   */
  abstract updateOne(options: FindOrFailOptions<T>, data: UpdateQuery<T>): Promise<T>;

  /**
   * Update a record by ID, throws NotFound error if not found
   * @param id Record ID
   * @param data Data to update the record
   * @param options Options to retrieve the record
   * @returns Promise<T>
   * @example service.updateById('uuid', { name: 'Jane Doe updated' }, { loadEagerRelations: false, errorMessage: 'Not found' })
   */
  abstract updateById(id: string, data: UpdateQuery<T>, options?: Partial<FindOrFailOptions<T>>): Promise<T>;

  /**
   * Delete a record, throws NotFound error if not found
   * @param options Options to retrieve the record
   * @returns Promise<T>
   * @example service.remove({ where: { name: 'John Doe' } })
   */
  abstract remove(options: FindOrFailOptions<T>): Promise<T>;

  /**
   * Delete a record by ID, throws NotFound error if not found
   * @param id Record ID
   * @param options Options to retrieve the record
   * @returns Promise<T>
   * @example service.removeById('uuid', { loadEagerRelations: false, errorMessage: 'Not found' })
   */
  abstract removeById(id: string, options?: Partial<FindOrFailOptions<T>>): Promise<T>;

  /**
   * Delete all records
   * @returns Promise<DeleteResult>
   * @example service.removeAll()
   */
  abstract removeAll(): Promise<DeleteResult>;

  /**
   * Soft delete a record, throws NotFound error if not found
   * @param options Options to retrieve the record
   * @returns Promise<T>
   * @example service.softRemove({ where: { name: 'John Doe' } })
   */
  abstract softRemove(options: FindOrFailOptions<T>): Promise<T>;

  /**
   * Soft delete a record by ID
   * @param id Record ID
   * @param options Options to retrieve the record
   * @returns Promise<T>
   * @example service.softRemoveById('uuid', { loadEagerRelations: false, errorMessage: 'Not found' })
   */
  abstract softRemoveById(id: string, options?: Partial<FindOrFailOptions<T>>): Promise<T>;

  /**
   * Soft delete all records
   * @returns Promise<UpdateWriteOpResult>
   * @example service.softRemoveAll()
   */
  abstract softRemoveAll(): Promise<UpdateWriteOpResult>;

  /**
   * Count records
   * @param options Options to retrieve the records
   * @returns Promise<number>
   * @example service.count({ where: { name: 'John Doe' } })
   */
  abstract count(options: Partial<FindOptions<T>>): Promise<number>;

  /**
   * Increment a field
   * @param where Options to retrieve the record
   * @param field Field name to increment
   * @param value Increment value
   * @param options Options to retrieve the record
   * @returns Promise<UpdateResult>
   * @example service.increment({ where: { name: 'John Doe' } }, 'age', 1)
   */
  abstract increment(
    where: FilterQuery<T>,
    field: string,
    value: number,
    options?: Partial<FindOptions<T>>,
  ): Promise<T>;

  /**
   * Decrement a field
   * @param where Options to retrieve the record
   * @param field Field name to decrement
   * @param value Decrement value
   * @param options Options to retrieve the record
   * @returns Promise<UpdateResult>
   * @example service.decrement({ where: { name: 'John Doe' } }, 'age', 1)
   */
  abstract decrement(
    where: FilterQuery<T>,
    field: string,
    value: number,
    options?: Partial<FindOptions<T>>,
  ): Promise<T>;

  /**
   * Get one record or create if not found
   * @param options Options to retrieve the record
   * @param data Data to create the record
   * @returns Promise<T>
   * @example service.getOneOrCreate({ where: { name: 'John Doe' } }, { name: 'John Doe' })
   */
  abstract getOneOrCreate(options: FindOptions<T>, data?: Partial<T>): Promise<T>;

  /**
   * Aggregate data
   * @param pipeline Aggregation pipeline stages
   * @param options Aggregation options
   * @returns Aggregate<Array<T>>
   */
  abstract aggregate(pipeline?: PipelineStage[], options?: AggregateOptions): Aggregate<Array<T>>;
}
