import {type CacheType, CommandInteraction, SlashCommandBuilder} from "discord.js";
import type {CommandType} from "../../types/CommandType.ts";

const command: CommandType = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.reply('Pong!');
    },
};

module.exports = command;