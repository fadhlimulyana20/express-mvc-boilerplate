import { User } from '../models/user';
import db from '../db/knex';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';

export class AuthService {
  static async register(username: string, password: string, role: string = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db('users').insert({ username, password: hashedPassword, role }).returning(['id', 'username', 'role', 'created_at', 'updated_at']);
    return user;
  }

  static async login(username: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await db('users').where({ username }).first();
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken, user };
  }

  static async refreshToken(token: string): Promise<string> {
    try {
      const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { id: number };
      const user = await db('users').where({ id: payload.id }).first();
      if (!user) throw new Error('User not found');
      return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  static async getMe(userId: number): Promise<User> {
    const user = await db('users').where({ id: userId }).first();
    if (!user) throw new Error('User not found');
    return user;
  }

  // Role management example
  static async assignRole(userId: number, role: string): Promise<User> {
    const [user] = await db('users').where({ id: userId }).update({ role }).returning(['id', 'username', 'role', 'created_at', 'updated_at']);
    if (!user) throw new Error('User not found');
    return user;
  }
}
