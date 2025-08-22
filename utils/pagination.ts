import { Knex } from 'knex';
import { GenericParams } from '../types/params/GenericParams';

export function applyPagination(
  query: Knex.QueryBuilder<any, any>,
  params?: GenericParams
): Knex.QueryBuilder<any, any> {
  if (!params) return query;
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const offset = (page - 1) * limit;
  return query.offset(offset).limit(limit);
}
