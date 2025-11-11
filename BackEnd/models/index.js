import { Sequelize } from 'sequelize';
import config from 'dotenv';

config.config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;

const sequelize = new Sequelize(dbDatabase, dbUser, dbPass, {
  host: dbHost,
  dialect: 'mysql',
  logging: false, // Desactiva logs de SQL en consola
});

export default sequelize;