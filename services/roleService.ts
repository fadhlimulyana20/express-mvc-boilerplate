import { Role } from '../models/role';
import db from '../db/knex';

export class RoleService {
  static async createRole(name: string, description?: string): Promise<Role> {
    const [role] = await db('roles').insert({ name, description }).returning(['id', 'name', 'description']);
    return role;
  }

  static async getAllRoles(params: { q?: string; page?: number; offset?: number } = {}): Promise<{ data: Role[]; total: number }> {
    const { q, page = 1, offset = 10 } = params;
    let query = db('roles').select('id', 'name', 'description');
    if (q) {
      query = query.whereILike('name', `%${q}%`).orWhereILike('description', `%${q}%`);
    }
    const totalQuery = query.clone().clearSelect().count<{ count: string }[]>({ count: '*' });
    const dataQuery = query.clone().offset((page - 1) * offset).limit(offset);
    const [totalResult, data] = await Promise.all([totalQuery, dataQuery]);
    const total = Number(totalResult[0]?.count || 0);
    return { data, total };
  }

  static async getRoleById(id: number): Promise<Role | undefined> {
    return db('roles').where({ id }).first();
  }

  static async updateRole(id: number, name: string, description?: string): Promise<Role> {
    const [role] = await db('roles').where({ id }).update({ name, description }).returning(['id', 'name', 'description']);
    return role;
  }

  static async deleteRole(id: number): Promise<void> {
    await db('roles').where({ id }).del();
  }
}
