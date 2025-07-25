import {
    ActionRowBuilder,
    type AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    type CacheType,
    Client,
    type CommandInteraction,
    EmbedBuilder,
    type InteractionReplyOptions,
    MessageFlags, type TextChannel
} from "discord.js";
import {config} from "../../config.ts";
import log from "./logger.ts";

/**
 * Handles an interaction to create an embed navigator.
 * @param interaction - The command interaction.
 * @param embeds - List of EmbedBuilder objects to navigate through.
 * @param files - List of AttachmentBuilder objects to attach to the message.
 * @param time - Time in milliseconds before the navigator expires.
 * @param ephemeral Whether to show the message or not
 */
async function handleEmbedNavigator(interaction: CommandInteraction<CacheType>, embeds: EmbedBuilder[], files: Map<number, AttachmentBuilder[]>, time: number, ephemeral: boolean = false): Promise<void> {
    if (embeds.length === 0) return; // If there are no embeds, do nothing.

    let currentIndex = 0; // Track the current embed index.

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true), // Disable if there's no previous embed.
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(embeds.length <= 1) // Disable if there's no next embed.
        );

    const updateButtons = (index: number): void => {
        if (!row.components[0] || !row.components[1]) throw new Error('Error creating navigation buttons.');
        row.components[0].setDisabled(index === 0);
        row.components[1].setDisabled(index === embeds.length - 1);
    };

    const replyOptions: InteractionReplyOptions = {
        embeds: [embeds[currentIndex] || new EmbedBuilder().setDescription('No embeds to display.')],
        components: [row],
        files: files.get(currentIndex) ? files.get(currentIndex) : [],
    };
    if (ephemeral) {
        replyOptions.flags = MessageFlags.Ephemeral;
    }
    await interaction.reply(replyOptions);

    const embedMessage = await interaction.fetchReply();

    const collector = embedMessage.createMessageComponentCollector({ time: time }); // Adjust time as needed.

    collector.on('collect', async buttonInteraction => {
        if (buttonInteraction.user.id !== interaction.user.id) {
            await buttonInteraction.reply({ content: "You cannot control this navigation.", flags: MessageFlags.Ephemeral});
            return;
        }

        switch (buttonInteraction.customId) {
            case 'previous':
                if (currentIndex > 0) currentIndex--;
                break;
            case 'next':
                if (currentIndex < embeds.length - 1) currentIndex++;
                break;
        }

        updateButtons(currentIndex);
        await buttonInteraction.update({
            embeds: [embeds[currentIndex] || new EmbedBuilder().setDescription('No embeds to display.')],
            components: [row],
            files: files.get(currentIndex) ? files.get(currentIndex) : [],
        });
    });
}

async function logToChannel(client: Client, text: string) {
    if (!config.bot.channels.log) return;
    try {
        const channel = await client.channels.fetch(config.bot.channels.log) as TextChannel;
        await channel.send(text)
    } catch (err) {
        log.error("Error logging event to log channel: " + text)
    }
}

async function errorInteractionReply(interaction: CommandInteraction<CacheType>, errorMessage: string, ephemeral: boolean = true): Promise<void> {
    await interaction.reply({
        embeds: [{
            description: errorMessage,
            color: config.colors.red
        }],
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
    });
}

export {handleEmbedNavigator, logToChannel, errorInteractionReply};