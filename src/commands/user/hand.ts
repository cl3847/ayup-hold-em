import {AttachmentBuilder, type CacheType, type ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import type {CommandType} from "../../types/CommandType.ts";
import Service from "../../services/Service.ts";
import {errorInteractionReply} from "../../utils/helpers.ts";
import {config} from "../../../config.ts";
import {renderUserHand} from "../../utils/render.ts";

const command: CommandType = {
    data: new SlashCommandBuilder()
        .setName('hand')
        .setDescription('Displays your daily hole cards and tarot card arrangement.'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const service = Service.getInstance();
        const discordUser = interaction.options.getUser('user') || interaction.user;
        const gameState = await service.game.getGameState();
        if (gameState.phase === 0) {
            await errorInteractionReply(interaction, `The next game day hasn't started yet.`);
            return;
        }

        // Check if the user exists in the database
        const user = await service.users.getUser(discordUser.id);
        if (!user) {
            await  errorInteractionReply(interaction,`User ${discordUser.username}'s profile does not exist. Use /start to get started.`);
            return;
        }

        // The user should have a hand, but if they don't tell them to ping a staff member
        let hand = await service.users.getUserHandToday(discordUser.id);
        if (!hand) {
            await errorInteractionReply(interaction, `You don't have a hand for today. This is a bug, so please ask staff for help.`);
            return;
        }

        // Reply with the user's hand and community cards
        const handImage = await renderUserHand(hand);
        const handImageAttachment = new AttachmentBuilder(handImage, {name: 'hand.png'});

        const showableCommunityCards = await hand.getShowableCommunityCards();
        const embed = {
            title: `${discordUser.username}'s Hand for Day ${gameState.day}`,
            fields: [
                {
                    "name": "Hole Cards",
                    "value": hand.getHoleCards().map(card => card.shortName).join(' | '),
                },
                {
                    "name": "Community Cards",
                    "value": showableCommunityCards.map(card => card.shortName).join(' | '),
                },

            ],
            color: config.colors.blue, // Red color
            image: {
                url: 'attachment://hand.png', // The image will be attached with this name
            },
        }

        await interaction.reply({embeds: [embed], files: [handImageAttachment]});
    },
};

module.exports = command;