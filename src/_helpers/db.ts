import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";

export interface Database {
    User: any;
    Account: any;
    RefreshToken: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    // ENV variables (safe for Render/Aiven)
    const host = process.env.DB_HOST;
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER;
    const password = process.env.DB_PASS;
    const database = process.env.DB_NAME;

    // ✅ proper validation (fix: no unsafe !)
    if (!host || !user || !password || !database) {
        throw new Error("Missing database environment variables");
    }

    let connection;

    try {
        // CREATE DATABASE (safe connection)
        connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
        });

        await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${database}\``
        );
    } catch (err) {
        console.error("MySQL connection failed:", err);
        throw err;
    } finally {
        if (connection) await connection.end();
    }

    // CONNECT SEQUELIZE (Aiven-safe)
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: "mysql",
        logging: false, // cleaner logs (recommended)
    });

    try {
        // IMPORT MODELS
        const { default: userModel } = await import("../users/user.model");
        const { default: accountModel } = await import("../accounts/account.model");
        const { default: refreshTokenModel } = await import("../accounts/refresh-token.model");

        // INIT MODELS
        db.User = userModel(sequelize);
        db.Account = accountModel(sequelize);
        db.RefreshToken = refreshTokenModel(sequelize);

        // RELATIONSHIPS
        db.Account.hasMany(db.RefreshToken, {
            onDelete: "CASCADE",
        });

        db.RefreshToken.belongsTo(db.Account);

        // SYNC DB
        await sequelize.sync({ alter: true });

        console.log("✅ DATABASE INITIALIZED AND MODELS SYNCED");
    } catch (err) {
        console.error("Sequelize initialization failed:", err);
        throw err;
    }
}