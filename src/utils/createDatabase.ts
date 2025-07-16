import type {PoolClient} from "pg";
import log from "./logger";

/**
 * Initializes the database by checking for the existence of required tables and creating them if they do not exist.
 * @param pc The PostgreSQL client to use for executing queries.
 */
const initDb = async (pc: PoolClient) => {
    const createTable = async (tableName: string, createSql: string) => {
        const checkQuery = `SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE  schemaname = 'public' 
            AND    tablename  = $1
        );`;
        const existsResult = await pc.query(checkQuery, [tableName]);
        if (!existsResult.rows[0].exists) {
            log.info(`Table '${tableName}' not found. Creating...`);
            await pc.query(createSql);
            log.success(`Table created: ${tableName}.`);
        }
    };

    // Execute checks and creation
    await createTable('users', `
        CREATE TABLE users (
            uid TEXT PRIMARY KEY,
            balance INT NOT NULL DEFAULT 0
        );`
    );

    await createTable('objects', `
        CREATE TABLE objects (
            name TEXT PRIMARY KEY,
            data JSONB DEFAULT '{}'
        );`
    );

    // check if gameState exists in objects
    if (!await pc.query(`SELECT * FROM objects WHERE name = 'gameState';`)) {
        await pc.query(`INSERT INTO objects (name, data) VALUES ('gameState', '{}');`);
    }
};

export {initDb}