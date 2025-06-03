import type {ConfigType} from "./src/types/ConfigType.ts";

require('dotenv').config();

export const config: ConfigType = {
    "bot": {
        "clientID": process.env.CLIENT_ID ?? "1245583548258451516", // The client ID of the bot
        "guildID": "1245589131405299802", // The guild ID of the bot
    }
};