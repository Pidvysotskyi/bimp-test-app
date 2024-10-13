import { Sequelize } from "sequelize";
const { POSTGRES_PASSWORD } = process.env;
const sequelize = new Sequelize(`postgres://postgres:${POSTGRES_PASSWORD}@postgres/postgres`);

export default sequelize;
