const fs = require('fs');
const path = require('path');
const db = require('./models');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForDatabase = async () => {
  const maxAttempts = Number(process.env.DB_CONNECT_RETRIES || 30);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await db.sequelize.authenticate();
      console.log('[database] connected');
      return;
    } catch (error) {
      console.log(`[database] waiting for connection (${attempt}/${maxAttempts})`);
      await sleep(2000);
    }
  }

  throw new Error('Database connection failed');
};

const runMigrations = async () => {
  if (process.env.RUN_MIGRATIONS === 'false') {
    return;
  }

  const migrationsPath = path.join(__dirname, 'migrations');
  const queryInterface = db.sequelize.getQueryInterface();

  await db.sequelize.query(
    'CREATE TABLE IF NOT EXISTS `SequelizeMeta` (`name` VARCHAR(255) NOT NULL PRIMARY KEY)'
  );

  const executedRows = await db.sequelize.query('SELECT `name` FROM `SequelizeMeta`', {
    type: db.Sequelize.QueryTypes.SELECT,
  });
  const executed = new Set(executedRows.map((row) => row.name));

  const migrationFiles = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith('.js'))
    .sort();

  for (const file of migrationFiles) {
    if (executed.has(file)) {
      continue;
    }

    console.log(`[database] running migration ${file}`);
    const migration = require(path.join(migrationsPath, file));
    await migration.up(queryInterface, db.Sequelize);
    await queryInterface.bulkInsert('SequelizeMeta', [{ name: file }]);
  }
};

const start = async () => {
  await waitForDatabase();
  await runMigrations();
  require('./index');
};

start().catch((error) => {
  console.error('[startup] failed:', error);
  process.exit(1);
});
