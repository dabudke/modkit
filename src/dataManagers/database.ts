import { Snowflake } from "discord.js";
import { Db, MongoClient } from "mongodb";
import { name } from "../meta/config";
import { CaseData } from "./caseManager";
import { GuildSettings } from "./settingManager";

export interface LocalGuild {
    settings: GuildSettings,
    cases: CaseData[]
}

const defaultGuild: LocalGuild = {
    settings: {
        modlog: {
            enabled: false,
            channel: null,
            sendMessageDeleteLogs: false,
            sendMessageMassDeleteLogs: false,
            sendMessagePurgeLogs: false,
            sendMessageEditLogs: false,
            sendUserWarningLogs: false,
            sendUserTimeoutLogs: false,
            sendUserKickLogs: false,
            sendUserBanLogs: false,
            sendUserUnbanLogs: false
        }
    },
    cases: []
};

let db: Db, mongo: MongoClient;

new MongoClient( process.env.DB_ADDR, {
    appName: name.toLowerCase().replace(" ","-"),
    retryWrites: true,
}).connect().then(client => { mongo = client, db = mongo.db(process.env.DB_NAME); console.log(`Logged into MongoDB (server: ${process.env.DB_ADDR}, database ${process.env.DB_NAME})`); });


export async function getGuild(id: Snowflake): Promise<LocalGuild> {
    const result =  await db.collection<LocalGuild>("guilds").findOne({ id: id });
    if (result === null) {
        await db.collection("guilds").insertOne({ id: id, ...defaultGuild });
        return defaultGuild;
    }
    return Object.assign(defaultGuild,result);
}

export async function updateGuild(id: Snowflake, data: LocalGuild) {
    await db.collection("guilds").replaceOne({ id: id }, data);
}
