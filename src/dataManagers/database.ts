import { Snowflake } from "discord.js";
import { Db, MongoClient } from "mongodb";
import { name } from "../meta/config";
import { CaseData, CaseId } from "./caseManager";

export interface LocalGuildSettings {
    modlog: {
        enabled: boolean,
        channel: Snowflake,
        sendMessageDeleteLogs: boolean,
        sendMessageMassDeleteLogs: boolean,
        sendMessageEditLogs: boolean,
        sendUserWarningLogs: boolean,
        sendUserTimeoutLogs: boolean,
        sendUserKickLogs: boolean,
        sendUserBanLogs: boolean,
        sendUserUnbanLogs: boolean
    }
}

export interface LocalGuild {
    settings: LocalGuildSettings,
    cases: CaseData[]
}

const defaultGuild: LocalGuild = {
    settings: {
        modlog: {
            enabled: false,
            channel: null,
            sendMessageDeleteLogs: false,
            sendMessageMassDeleteLogs: false,
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

new MongoClient( process.env.DB_PORT, {
    appName: name.toLowerCase().replace(" ","-"),
    retryWrites: true,
}).connect().then(client => {mongo = client, db = mongo.db(process.env.DB_NAME); });


export async function getGuild(id: Snowflake): Promise<LocalGuild> {
    const result =  await db.collection<LocalGuild>("guilds").findOne({ id: id });
    if (result === null) {
        await db.collection("guilds").insertOne({ id: id, ...defaultGuild });
        return defaultGuild;
    }
    return result;
}

export async function updateGuild(id: Snowflake, data: LocalGuild) {
    await db.collection("guilds").replaceOne({ id: id }, data);
}
