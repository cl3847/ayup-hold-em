import {type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import type {CommandType} from "../../types/CommandType.ts";
import Service from "../../services/Service.ts";
import {drawRandomNCards} from "../../utils/cards.ts";
import type {UserBoard} from "../../models/user/UserBoard.ts";
import {logToChannel} from "../../utils/helpers.ts";

const command: CommandType = {
    data: new SlashCommandBuilder()
        .setName('draw')
        .setDescription('Draws your daily hole cards.'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const service = Service.getInstance();
        const discordUser = interaction.options.getUser('user') || interaction.user;

        // Check if the user exists in the database
        const user = await service.users.getUser(discordUser.id);
        if (!user) {
            await interaction.reply(`- LOOKUP FAILED -\nUser ${discordUser.username}'s profile does not exist. Use /start to get started.`);
            return;
        }

        // Check if the user has already drawn cards today
        let hand = await service.users.getUserHandToday(discordUser.id);
        if (!hand) { // Cards have not been drawn today, so we can draw them
            try {
                const gameState = await service.game.getGameState();
                if (gameState.phase === 2) {
                    await interaction.reply(`- DRAW FAILED -\nThe next day hasn't begun yet!`);
                    return;
                }

                const newHoleCards = drawRandomNCards(2);
                const newUserBoard: UserBoard = {
                    uid: discordUser.id,
                    day: gameState.day,
                    hole1: newHoleCards[0]!.code,
                    hole2: newHoleCards[1]!.code,
                }
                await service.users.createUserBoard(newUserBoard);
                hand = await service.users.getUserHandToday(discordUser.id);
                await logToChannel(interaction.client, `🍀 **${discordUser.username}** has drawn their daily hole cards: ${newHoleCards.map(c => c.shortName).join(" | ")}`);
            } catch (err) {
                await interaction.reply(`- DRAW FAILED -\nAn error occurred while drawing your cards. Please try again later.`);
                console.error(err);
                return;
            }
        }

        // Reply with the drawn cards
        if (!hand) throw new Error("User hand should not be null after drawing cards, but it is.");
        await interaction.reply(`Your daily hole cards are: ${hand.hole1.shortName} | ${hand.hole2.shortName}`);
    },
};

module.exports = command;