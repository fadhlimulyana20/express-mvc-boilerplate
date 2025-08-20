import { AuthService } from '../services/authService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../db/knex', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  describe('register', () => {
    it('should hash password and insert user', async () => {
      const db = require('../db/knex').default;
      const mockUser = { id: 1, username: 'test', role: 'user', created_at: '', updated_at: '' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      db.mockImplementation(() => ({
        insert: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockUser]),
      }));
      const user = await AuthService.register('test', 'pass');
      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(user).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should return tokens and user if credentials are valid', async () => {
      const db = require('../db/knex').default;
      const mockUser = { id: 1, username: 'test', password: 'hashed', role: 'user' };
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockUser),
      }));
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValueOnce('access').mockReturnValueOnce('refresh');
      const result = await AuthService.login('test', 'pass');
      expect(result.accessToken).toBe('access');
      expect(result.refreshToken).toBe('refresh');
      expect(result.user).toEqual(mockUser);
    });
    it('should throw if user not found', async () => {
      const db = require('../db/knex').default;
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined),
      }));
      await expect(AuthService.login('notfound', 'pass')).rejects.toThrow('Invalid credentials');
    });
    it('should throw if password invalid', async () => {
      const db = require('../db/knex').default;
      const mockUser = { id: 1, username: 'test', password: 'hashed', role: 'user' };
      db.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockUser),
      }));
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(AuthService.login('test', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });
});
