import { createPool } from 'mysql2/promise';
import config from 'dotenv';

config.config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

export const pool = createPool({
  host: dbHost,
  user: dbUser,
  password: dbPass,
  database: dbDatabase,
});
