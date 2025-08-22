import { User } from '../models/user';
import db from '../db/knex';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import appConfig from '../config';
import { RegisterUserParams } from 'types/params/RegisterUserParams';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '60d';

export class AuthService {
  static async register(param: RegisterUserParams): Promise<User> {
    const {roles = ['user'] } = param;
    const hashedPassword = await bcrypt.hash(param.password, 10);

    // Insert user
    const [user] = await db('users').insert({ 
      ...param,
      password: hashedPassword
    }).returning(['id', 'username', 'created_at', 'updated_at']);
    
    // Get role ids
    const roleRows = await db('roles').whereIn('name', roles);
    const userRoles = roleRows.map((role: any) => ({ user_id: user.id, role_id: role.id }));
    if (userRoles.length) {
      await db('user_roles').insert(userRoles);
    }
    
    // Attach roles to user object
    user.roles = roleRows;
    return user;
  }

  static async login(identifier: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    try {
      const user = await db('users')
        .where('username', identifier)
        .orWhere('email', identifier)
        .first();
      if (!user) throw new Error('Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      // Get roles
      const roles = await db('roles')
        .join('user_roles', 'roles.id', 'user_roles.role_id')
        .where('user_roles.user_id', user.id)
        .select('roles.*');

      user.roles = roles;
      const accessToken = jwt.sign(
        { id: user.id, username: user.username, roles: roles.map((r: any) => r.name) },
        appConfig.jwt.secret,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { id: user.id },
        appConfig.jwt.refreshSecret,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
      );

      return { accessToken, refreshToken, user };
    } catch (err) {
      throw new Error('Login failed');
    }
  }

  static async refreshToken(token: string): Promise<string> {
    try {
      const payload = jwt.verify(token, appConfig.jwt.refreshSecret) as { id: number };
      const user = await db('users').where({ id: payload.id }).first();
      if (!user) throw new Error('User not found');
      const roles = await db('roles')
        .join('user_roles', 'roles.id', 'user_roles.role_id')
        .where('user_roles.user_id', user.id)
        .select('roles.*');
      return jwt.sign({ id: user.id, username: user.username, roles: roles.map((r: any) => r.name) }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  static async getMe(userId: number): Promise<User> {
    const user = await db('users').where({ id: userId }).first();
    if (!user) throw new Error('User not found');
    const roles = await db('roles')
      .join('user_roles', 'roles.id', 'user_roles.role_id')
      .where('user_roles.user_id', user.id)
      .select('roles.*');
    user.roles = roles;
    return user;
  }

  // Assign a role to a user (add to user_roles)
  static async assignRole(userId: number, roleName: string): Promise<User> {
    const role = await db('roles').where({ name: roleName }).first();
    if (!role) throw new Error('Role not found');
    await db('user_roles').insert({ user_id: userId, role_id: role.id }).onConflict(['user_id', 'role_id']).ignore();
    // Return user with updated roles
    return this.getMe(userId);
  }
}
