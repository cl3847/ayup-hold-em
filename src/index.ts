import log from './utils/logger.ts';
import {Client, Collection, Events, IntentsBitField, REST} from "discord.js";
import {Pool, types} from "pg";
// @ts-ignore
import {Routes} from "discord-api-types/v9";

import type {CommandType} from "./types/CommandType.ts";
import * as path from "node:path";
import * as fs from "node:fs";
import {config} from '../config.ts';
import {initDb} from "./utils/createDatabase.ts";
import type {DAOs} from "./models/DAOs.ts";
import UserDAO from "./handlers/UserDAO.ts";
import Service from "./services/Service.ts";

require('dotenv').config();

async function main() {
    if (!process.env.DATABASE_URL || !process.env.DISCORD_TOKEN) {
        log.error("Missing environment variables, exiting.");
        process.exit(1);
    }

    const pool = await databaseSetup();
    await serviceSetup(pool);
    await discordSetup();
}

/**
 * Sets up the database connection and initializes the database if any tables don't exist.
 * @returns {Promise<Pool>} The PostgreSQL connection pool.
 */
async function databaseSetup(): Promise<Pool> {
    // create database connection pool
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: {
            rejectUnauthorized: false
        }
    });

    types.setTypeParser(20, (val) => parseInt(val, 10)); // parse int8 as number

    // test connection to database, and initialize tables if not created
    try {
        const pc = await pool.connect();
        log.success("Connected to Postgres database.");
        await initDb(pc);
        pc.release();
    } catch (err: any) { // exit if we can't connect to the database
        log.error(err.message);
        process.exit(1);
    }

    return pool;
}

/**
 * Initializes the service layer with DAOs and the database connection pool.
 * @param pool {Pool} The PostgreSQL connection pool.
 */
async function serviceSetup(pool: Pool) {
    const daos: DAOs = {
        users: new UserDAO(),
    }
    await Service.init(daos, pool);
}

/**
 * Sets up the Discord bot, registers commands, and handles interactions.
 */
async function discordSetup(): Promise<void> {
    const client = new Client({
        intents: [IntentsBitField.Flags.Guilds],
    });

    client.once(Events.ClientReady, readyClient => {
        log.success(`Logged into Discord as ${readyClient.user.tag}.`);
    });

    try {
        await client.login(process.env.DISCORD_TOKEN);
    } catch (err: any) { // exit if we can't start the discord bot
        log.error(err.message);
        process.exit(1);
    }

    const commands: Collection<string, CommandType> = new Collection();
    const commandData = [];
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${foldersPath}/${folder}`).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const command: CommandType = require(`./commands/${folder}/${file}`);
            commandData.push(command.data);
            commands.set(command.data.name, command);
        }
    }

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand()) return; // return if the interaction is not a command

        const command = commands.get(interaction.commandName);
        if (!command) { // return if the command does not exist
            log.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            try {
                await command.execute(interaction);
            } catch (error) { // something went wrong while executing the command
                log.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: 'There was an error while executing this command!',
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        ephemeral: true
                    });
                }
            }
        } catch (err: any) { // something really weird happened
            log.error(err.stack);
        }
    });

    if (!process.env.DISCORD_TOKEN) {
        log.error("Discord token is not set in .env, exiting.");
        process.exit(1);
    }
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        log.info(`Started refreshing ${commandData.length} application (/) commands.`);
        const data: any = await rest.put(
            Routes.applicationGuildCommands(config.bot.clientID, config.bot.guildID),
            {body: commandData},
        );

        log.success(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        log.error(error);
    }
}

main();
