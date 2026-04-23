import { Sequelize } from 'sequelize';

const db = new Sequelize('db_pengsalaryan3', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;