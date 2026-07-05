import 'reflect-metadata';
import { createMigrationDataSource } from './typeorm.data-source';

async function reset(): Promise<void> {
  const dataSource = createMigrationDataSource();
  await dataSource.initialize();

  console.log('Resetting database (drop + migrate)...');
  await dataSource.dropDatabase();

  const executed = await dataSource.runMigrations();
  await dataSource.destroy();

  if (executed.length === 0) {
    console.log('Database reset complete (no migrations applied).');
    return;
  }

  for (const migration of executed) {
    console.log(`Applied: ${migration.name}`);
  }

  console.log(`Database reset complete (${executed.length} migrations).`);
}

reset().catch((error) => {
  console.error('Database reset failed:', error);
  process.exit(1);
});
