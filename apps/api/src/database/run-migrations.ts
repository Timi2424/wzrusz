import 'reflect-metadata';
import { createMigrationDataSource } from './typeorm.data-source';

async function run(): Promise<void> {
  const dataSource = createMigrationDataSource();
  await dataSource.initialize();
  const executed = await dataSource.runMigrations();
  await dataSource.destroy();

  if (executed.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  for (const migration of executed) {
    console.log(`Applied: ${migration.name}`);
  }
}

run().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
