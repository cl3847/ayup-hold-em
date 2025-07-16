import {
    AttachmentBuilder,
    type CacheType,
    CommandInteraction,
    EmbedBuilder,
    MessageFlags,
    SlashCommandBuilder
} from "discord.js";
import Service from "../../services/Service.ts";
import {config} from "../../../config.ts";
import {handleEmbedNavigator} from "../../utils/helpers.ts";
import type {CommandType} from "../../types/CommandType.ts";

const command: CommandType = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Creates a profile for you and/or starts a tutorial.'),
    async execute(interaction: CommandInteraction<CacheType>) {
        const service = Service.getInstance();
        const user = await service.users.getUser(interaction.user.id);
        if (!user) {
            try {
                await service.users.initUser(interaction.user.id);
            } catch (err) {
                await interaction.reply({embeds: [{description: "Your account could not be set up.", color: config.colors.blue}], flags: MessageFlags.Ephemeral});
                return;
            }
        }
        await handleEmbedNavigator(interaction, tutorialEmbeds, new Map<number, AttachmentBuilder[]>(), 300_000, true);
    },
};

const tutorialEmbeds = [
    new EmbedBuilder() // page 1
        .setTitle('Tutorial: Placeholder')
        .setColor(config.colors.blue)
        .setDescription(`Welcome to Ayup Hold 'Em! This is a placeholder.`)
        .setImage(`https://en.m.wikipedia.org/wiki/File:Typescript_logo_2020.svg`)
        .setFooter({text: 'Page 1/6'}),
];

module.exports = command;