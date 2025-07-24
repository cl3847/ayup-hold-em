import type {PoolClient} from "pg";
import log from "./logger";
import {cardMap} from "./cards.ts";
import {config} from "../../config.ts";
import {tarotList} from "./tarots.ts";

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

    // ensure the card codes enum exists
    const cardEnumCheck = await pc.query("SELECT 1 FROM pg_type WHERE typname = 'card_code'");
    if (cardEnumCheck.rowCount === 0) {
        log.info("Enum 'card_code' not found. Creating...");
        const cardCodes = Array.from(cardMap.keys());
        const enumValues = cardCodes.map(code => `'${code}'`).join(', ');
        const createEnumQuery = `CREATE TYPE card_code AS ENUM (${enumValues});`;

        await pc.query(createEnumQuery);
        log.success("Successfully created enum 'card_code'.");
    }

    // ensure the tarot codes enum exists
    const tarotEnumCheck = await pc.query("SELECT 1 FROM pg_type WHERE typname = 'tarot_code'");
    if (tarotEnumCheck.rowCount === 0) {
        log.info("Enum 'tarot_code' not found. Creating...");
        const tarotValues = tarotList.map(tarot => `'${tarot.code}'`).join(', ');
        const createTarotQuery = `CREATE TYPE tarot_code AS ENUM (${tarotValues});`;

        await pc.query(createTarotQuery);
        log.success("Successfully created enum 'tarot_code'.");
    }

    // Execute checks and creation
    await createTable('users', `
        CREATE TABLE users (
            uid TEXT PRIMARY KEY,
            balance INT NOT NULL DEFAULT 0
        );`
    );

    await createTable('users_boards', `
        CREATE TABLE users_boards (
            uid TEXT NOT NULL,
            day INT NOT NULL,
            hole1 card_code NOT NULL,
            hole2 card_code NOT NULL,
            PRIMARY KEY (uid, day),
            FOREIGN KEY (uid) REFERENCES users(uid) ON UPDATE CASCADE ON DELETE CASCADE,
            FOREIGN KEY (day) REFERENCES boards(day) ON UPDATE CASCADE ON DELETE CASCADE
        );`
    );
    
    await createTable('objects', `
        CREATE TABLE objects (
            name TEXT PRIMARY KEY,
            data JSONB DEFAULT '{}'
        );`
    );

    await createTable('boards', `
        CREATE TABLE boards (
            day INT PRIMARY KEY,
            flop1 card_code NOT NULL,
            flop2 card_code NOT NULL,
            flop3 card_code NOT NULL,
            turn card_code NOT NULL,
            river card_code NOT NULL
        );`
    );

    // check if gameState exists in objects
    const gameStateCheck = await pc.query(`SELECT * FROM objects WHERE name = 'gameState';`);
    if (gameStateCheck.rowCount === 0) {
        log.info("Object 'gameState' not found. Creating...");
        await pc.query(`INSERT INTO objects (name, data) VALUES ($1, $2);`, ['gameState', config.initialGameState]);
        log.success("Successfully created object 'gameState'.");
    }
};

export {initDb}