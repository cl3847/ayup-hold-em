import {AttachmentBuilder, Client, EmbedBuilder, type TextChannel} from "discord.js";
import * as cron from "node-cron";
import Service from "../services/Service.ts";
import log from "./logger.ts";
import {cardMap, drawRandomNCards} from "./cards.ts";
import {config} from "../../config.ts";
import type {GameState} from "../models/GameState.ts";
import {renderBoard} from "./render.ts";
import type {UserBoard} from "../models/user/UserBoard.ts";

function initJobs(client: Client) {
    cron.schedule('00 0 * * *', () => runTheFlop(client)); // draw the flop every day at midnight (4 AM UTC)
    cron.schedule('00 12 * * *', () => runTheTurn(client)); // draw the turn every day at noon (4 PM UTC)
    cron.schedule('00 23 * * *', () => runTheRiver(client)); // draw the river every day at 11 PM (3 AM UTC)
}

async function runTheFlop(client: Client) {
    const service = Service.getInstance();
    let gameState = await service.game.getGameState();
    if (gameState.phase === 0) { // The river is done
        log.info("Drawing the flop.");
        // Start a new board for the next day
        try {
            const newBoard = await service.boards.createBoardIncrementDay();
            gameState = await service.game.getGameState(); // Refresh the game state after creating a new board

            // Draw hole cards for all users for the new day
            await drawAllUserHoleCards();

            const flop = [newBoard.flop1, newBoard.flop2, newBoard.flop3].map(code => cardMap.get(code)!);
            try {
                const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
                const boardImage = await renderBoard(flop);
                const boardEmbedAttachment = new AttachmentBuilder(boardImage, {name: 'board.png'});
                const boardEmbed = new EmbedBuilder()
                    .setTitle(`Day ${gameState.day} | Flop Draw`)
                    .setDescription(`FLOP: ${flop.map(code => code.shortName).join(' | ')}`)
                    .setImage(`attachment://board.png`)
                    .setColor(config.colors.red)
                await channel.send({
                    embeds: [boardEmbed],
                    files: [boardEmbedAttachment]
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
        log.info("Drawing the turn.");
        const turn = cardMap.get(board.turn)!;
        const communityDisplayableCards = [board.flop1, board.flop2, board.flop3, board.turn].map(code => cardMap.get(code)!);
        try {
            const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
            const boardImage = await renderBoard(communityDisplayableCards);
            const boardEmbedAttachment = new AttachmentBuilder(boardImage, {name: 'board.png'});
            const boardEmbed = new EmbedBuilder()
                .setTitle(`Day ${gameState.day} | Turn Draw`)
                .setDescription(`Turn: ${turn.shortName}`)
                .setImage(`attachment://board.png`)
                .setColor(config.colors.red)
            await channel.send({
                embeds: [boardEmbed],
                files: [boardEmbedAttachment]
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
        log.info("Drawing the river.");
        const river = cardMap.get(board.river)!;
        const communityDisplayableCards = [board.flop1, board.flop2, board.flop3, board.turn, board.river].map(code => cardMap.get(code)!);
        try {
            const channel = await client.channels.fetch(config.bot.channels.dealer) as TextChannel;
            const boardImage = await renderBoard(communityDisplayableCards);
            const boardEmbedAttachment = new AttachmentBuilder(boardImage, {name: 'board.png'});
            const boardEmbed = new EmbedBuilder()
                .setTitle(`Day ${gameState.day} | River Draw`)
                .setDescription(`River: ${river.shortName}`)
                .setImage(`attachment://board.png`)
                .setColor(config.colors.red)
            await channel.send({
                embeds: [boardEmbed],
                files: [boardEmbedAttachment]
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

async function drawAllUserHoleCards() {
    const service = Service.getInstance();
    const gameState = await service.game.getGameState();
    if (gameState.phase === 0) { // Starting a new day
        log.info("Drawing hole cards for all users for the new day.");
        const users = await service.users.getAllUsers();
        for (const user of users) {
            try {
                // If the user had tarot cards in the previous day, we keep them
                const previousUserBoard = await service.users.getUserHandOnDay(user.uid, gameState.day - 1);
                const newHoleCards = drawRandomNCards(2);
                const newUserBoard: UserBoard = {
                    uid: user.uid,
                    day: gameState.day, // Increment the day for the new board
                    hole1: newHoleCards[0]!.code,
                    hole2: newHoleCards[1]!.code,
                    tarot1: previousUserBoard?.tarot1?.code ?? null, // Keep the previous tarot card if exists
                    tarot2: previousUserBoard?.tarot2?.code ?? null,
                };


                if (previousUserBoard) {

                }

                await service.users.createUserBoard(newUserBoard );
            } catch (err) {
                log.error(`Failed to draw hole cards for user ${user.uid}`);
                log.error(err);
            }
        }
        log.info("All users' hole cards have been drawn for the new day.");
    } else {
        log.error("Game phase mismatch, skipping drawing all user hole cards.");
    }
}

export default initJobs;