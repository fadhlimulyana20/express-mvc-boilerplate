import db from './db/knex.js';

(async () => {
  try {
    await db.raw('SELECT 1+1 AS result');
    console.log('Knex connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('Knex connection failed:', err);
    process.exit(1);
  }
})();
