import type {ConfigType} from "./src/types/ConfigType.ts";

require('dotenv').config();

export const config: ConfigType = {
    "bot": {
        "clientID": process.env.CLIENT_ID ?? "1245583548258451516", // The client ID of the bot
        "guildID": "1245589131405299802", // The guild ID of the bot
        "channels": {
            "dealer": "1395227013765267566"
        }
    },
    "game": {
        "startingBalance": 0, // The starting balance for new users
    },
    "initialGameState": {
        "day": 0, // The initial day of the game
        "phase": 0, // The initial phase of the game
    },
    "colors": {
        "blue": 0x5865f2,
        "red": 0xff5001,
    }
};