import { BaseModel } from './base.model';
import { FilterQuery, SortOrder } from 'mongoose';

declare global {
  type FindOptions<T extends BaseModel> = {
    /** Condition */
    where?: FilterQuery<T>;
    /** Sorting
     * @example { createdAt: -1 }
     */
    sort?: string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][] | undefined | null;
    /** Joins */
    relations?: string | string[];
    /** Includes deleted data */
    withDeleted?: boolean;
    /** Select specific fields from DB */
    select?: string | string[];
  };

  type FindOrFailOptions<T extends BaseModel> = FindOptions<T> & {
    /** Error message if record is not found */
    errorMessage?: string;
  };

  type FindPaginatedOptions<T extends BaseModel> = Partial<FindOptions<T>> & {
    /** Number of items per page */
    limit?: number;
    /** Current page number */
    page?: number;
    /**
     * Filter
     * @examples { "name": "ABC" }
     */
    filter?: FilterQuery<T>;
    /** Search */
    search?: string;
  };

  type GenerateTokenData = {
    accessToken: string;
  };

  type LogoutData = {
    success: boolean;
  };
  type DeleteResult = {
    acknowledged: boolean;
    deletedCount: number;
  };
  class IResponse<T extends BaseModel> {
    /** Response status code */
    status!: number;
    /** Data */
    data!: T;
    /** Pagination data */
    pagination?: {
      /** Number of items per page */
      limit: number;
      /** Current page number */
      page: number;
      /** Total number of items */
      total: number;
    };
  }
  class IPaginationResponse<T> {
    /** Array of items */
    @Expose()
    data!: T[];

    @Expose()
    pagination!: IPagination;
  }
}

export {};
