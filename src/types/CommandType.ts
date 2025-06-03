import {AutocompleteInteraction, CommandInteraction, SharedSlashCommand} from "discord.js";

export type CommandType = {
    data: SharedSlashCommand;
    execute(interaction: CommandInteraction): Promise<void>;
    autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
};