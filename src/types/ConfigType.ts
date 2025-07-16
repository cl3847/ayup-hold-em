export type ConfigType = {
    bot: {
        clientID: string; // The client ID of the bot
        guildID: string; // The guild ID of the bot
    };
    game: {
        startingBalance: number; // The starting balance for new users
    };
    colors: {
        blue: number; // The color used for embeds and other UI elements
    };
};