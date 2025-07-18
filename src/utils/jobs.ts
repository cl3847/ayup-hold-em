import {Client, type TextChannel} from "discord.js";
import * as cron from "node-cron";
import Service from "../services/Service.ts";
import log from "./logger.ts";
import {cardMap} from "./cards.ts";
import {config} from "../../config.ts";
import type {GameState} from "../models/GameState.ts";

function initJobs(client: Client) {
    cron.schedule('00 4 * * *', () => runTheFlop(client)); // draw the flop every day at midnight (4 AM UTC)
    cron.schedule('00 16 * * *', () => runTheTurn(client)); // draw the turn every day at noon (4 PM UTC)
    cron.schedule('00 3 * * *', () => runTheRiver(client)); // draw the river every day at 11 PM (3 AM UTC)
}

async function runTheFlop(client: Client) {
    const service = Service.getInstance();
    let gameState = await service.game.getGameState();
    if (gameState.phase === 0) { // The river is done
        // Start a new board for the next day
        try {
            const newBoard = await service.boards.createBoardIncrementDay();
            gameState = await service.game.getGameState(); // Refresh the game state after creating a new board
            const flop = [newBoard.flop1, newBoard.flop2, newBoard.flop3];
            try {
                const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
                await channel.send({
                    embeds: [
                        {
                            title: `Day ${gameState.day} | Flop Draw`,
                            description: `FLOP: ${flop.map(code => cardMap.get(code)!.shortName).join(' | ')}`,
                            color: config.colors.red
                        }
                    ]
                });
                log.info("Flop draw sent to dealer channel.");

                // Update the game state to reflect the flop draw
                gameState.phase = 1;
                await Service.getInstance().game.updateGameState(gameState);
            } catch (err) {
                log.error("Could not send Flop to dealer channel.");
                log.error(err);
            }
        } catch (err) {
            log.error("Could not create a new board for the next day.");
            log.error(err);
        }
    } else {
        log.error("Game phase mismatch, skipping Flop draw.");
    }
}

async function runTheTurn(client: Client) {
    const service = Service.getInstance();
    const gameState: GameState = await service.game.getGameState();
    const board = await service.boards.getBoard(gameState.day);
    if (gameState.phase === 1 && board) { // The flop is done and we have a board
        const turn = cardMap.get(board.turn)!;
        try {
            const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
            await channel.send({
                embeds: [
                    {
                        title: `Day ${gameState.day} | Turn Draw`,
                        description: `THE TURN: ${turn?.shortName}`,
                        color: config.colors.red
                    }
                ]
            });
            log.info("Turn draw sent to dealer channel.");

            // Update the game state to reflect the turn draw
            gameState.phase = 2;
            await Service.getInstance().game.updateGameState(gameState);
        } catch (err) {
            log.error("Could not send Turn to dealer channel.");
            log.error(err);
        }
    } else {
        log.error("Game phase mismatch, skipping Turn draw.");
    }
}

async function runTheRiver(client: Client) {
    const service = Service.getInstance();
    const gameState: GameState = await service.game.getGameState();
    const board = await service.boards.getBoard(gameState.day);
    if (gameState.phase === 2 && board) { // The turn is done
        const river = cardMap.get(board.river)!;
        try {
            const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
            await channel.send({
                embeds: [
                    {
                        title: `Day ${gameState.day} | River Draw`,
                        description: `RIVER: ${river.shortName}`,
                        color: config.colors.red
                    }
                ]
            });
            log.info("River draw sent to dealer channel.");

            // Update the game state to reflect the river draw
            gameState.phase = 0;
            await Service.getInstance().game.updateGameState(gameState);
        } catch (err) {
            log.error("Could not send River to dealer channel.");
            log.error(err);
        }
    } else {
        log.error("Game phase mismatch, skipping River draw.");
    }
}

export default initJobs;