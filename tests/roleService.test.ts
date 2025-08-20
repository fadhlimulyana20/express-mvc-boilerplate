import { RoleService } from '../services/roleService';

jest.mock('../db/knex', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('RoleService', () => {
  describe('getAllRoles', () => {
    it('should return roles and total count', async () => {
      // Arrange
      const mockRoles = [
        { id: 1, name: 'Admin', description: 'Administrator' },
        { id: 2, name: 'User', description: 'Regular user' },
      ];
      const mockCount = [{ count: '2' }];
      // Mock db behavior
      const db = require('../db/knex').default;
      db.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        whereILike: jest.fn().mockReturnThis(),
        orWhereILike: jest.fn().mockReturnThis(),
        clone: jest.fn().mockReturnThis(),
        clearSelect: jest.fn().mockReturnThis(),
        count: jest.fn().mockResolvedValueOnce(mockCount),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: (cb: any) => cb(mockRoles),
      }));

      // Act
      const result = await RoleService.getAllRoles();

      // Assert
      expect(result.data).toEqual(mockRoles);
      expect(result.total).toBe(2);
    });
  });
});
