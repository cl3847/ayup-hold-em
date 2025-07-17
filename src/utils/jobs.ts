import {Client, type TextChannel} from "discord.js";
import * as cron from "node-cron";
import Service from "../services/Service.ts";
import log from "./logger.ts";
import {getRandomCard, getRandomFlop} from "./cards.ts";
import {config} from "../../config.ts";

function initJobs(client: Client) {
    cron.schedule('00 00 * * *', () => runTheFlop(client)); // draw the flop every day at midnight
    cron.schedule('00 12 * * *', () => runTheTurn(client)); // draw the turn every day at noon
    cron.schedule('00 23 * * *', () => runTheRiver(client)); // draw the river every day at 11 PM
}

async function runTheFlop(client: Client) {
    const gameState = await Service.getInstance().game.getGameState();
    if (gameState.phase === 0) { // The river is done
        const flop = getRandomFlop(); // implement this function to get a random flop
        // TODO: Send the flop information to the backend
        try {
            const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
            await channel.send({
               embeds: [
                    {
                        title: `Day ${gameState.date} | Flop Draw`,
                        description: `FLOP: ${flop.map(card => card.shortName).join(' | ')}`,
                        color: config.colors.red
                    }
                ]
            });

            // Update the game state to reflect the flop draw
            await Service.getInstance().game.updateGameState({
                phase: 1, // Update to the next phase after flop
                date: gameState.date + 1 // Increment the date
            });
        } catch (err) {
            log.error("Could not send Flop to dealer channel.");
            log.error(err);
        }

    } else {
        log.error("Game phase mismatch, skipping Flop draw.");
    }
}

async function runTheTurn(client: Client) {
    const gameState = await Service.getInstance().game.getGameState();
    if (gameState.phase === 1) { // The flop is done
        const turn = getRandomCard(); // implement this function to get a random turn card
        try {
            const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
            await channel.send({
                embeds: [
                    {
                        title: `Day ${gameState.date} | Turn Draw`,
                        description: `THE TURN: ${turn.shortName}`,
                        color: config.colors.red
                    }
                ]
            });

            // Update the game state to reflect the turn draw
            await Service.getInstance().game.updateGameState({
                phase: 2, // Update to the next phase after turn
                date: gameState.date
            });
        } catch (err) {
            log.error("Could not send Turn to dealer channel.");
            log.error(err);
        }
    } else {
        log.error("Game phase mismatch, skipping Turn draw.");
    }
}

async function runTheRiver(client: Client) {
    const gameState = await Service.getInstance().game.getGameState();
    if (gameState.phase === 2) { // The turn is done TODO: Change this to the correct phase
        const river = getRandomCard(); // implement this function to get a random flop
        // TODO: Send the river information to the backend
        try {
            const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
            await channel.send({
                embeds: [
                    {
                        title: `Day ${gameState.date} | River Draw`,
                        description: `RIVER: ${river.shortName}`,
                        color: config.colors.red
                    }
                ]
            });

            // Update the game state to reflect the river draw
            await Service.getInstance().game.updateGameState({
                phase: 0, // Reset to the initial phase after river
                date: gameState.date
            });
        } catch (err) {
            log.error("Could not send River to dealer channel.");
            log.error(err);
        }
    } else {
        log.error("Game phase mismatch, skipping River draw.");
    }
}

export default initJobs;