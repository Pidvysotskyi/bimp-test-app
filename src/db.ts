import { Sequelize } from "sequelize";
const sequelize = new Sequelize("postgres://postgres:12345678@localhost:5432/postgres");

export default sequelize;
