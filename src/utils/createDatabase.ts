import type {PoolClient} from "pg";
import log from "./logger";
import {cardMap} from "./cards.ts";

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

    // ensure the card enum exists
    const cardEnumCheck = await pc.query("SELECT 1 FROM pg_type WHERE typname = 'card_code'");
    if (cardEnumCheck.rowCount === 0) {
        log.info("Enum 'card_code' not found. Creating...");
        const cardCodes = Array.from(cardMap.keys());
        const enumValues = cardCodes.map(code => `'${code}'`).join(', ');
        const createEnumQuery = `CREATE TYPE card_code AS ENUM (${enumValues});`;

        await pc.query(createEnumQuery);
        log.success("Successfully created enum 'card_code'.");
    }

    // Execute checks and creation
    await createTable('users', `
        CREATE TABLE users (
            uid TEXT PRIMARY KEY,
            balance INT NOT NULL DEFAULT 0,
            hole1 card_code DEFAULT NULL,
            hole2 card_code DEFAULT NULL
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