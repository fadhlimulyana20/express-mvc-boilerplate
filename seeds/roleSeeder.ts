/**
 * Seeder for roles table (TypeScript)
 * Run with: npx knex seed:run --specific=roleSeeder.ts
 */
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('roles').del();
  // Inserts seed entries
  await knex('roles').insert([
    { id: 1, name: 'admin', description: 'Administrator role' },
    { id: 2, name: 'user', description: 'Standard user role' },
    { id: 3, name: 'guest', description: 'Guest user role' }
  ]);
}
