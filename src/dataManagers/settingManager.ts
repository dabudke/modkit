import { Snowflake } from "discord.js";
import { getGuild, updateGuild } from "./database";

export interface GuildSettings {
    modlog: {
        enabled: boolean,
        channel: Snowflake,
        sendMessageMassDeleteLogs: boolean,
        sendMessageDeleteLogs: boolean,
        sendMessagePurgeLogs: boolean,
        sendMessageEditLogs: boolean,
        sendUserWarningLogs: boolean,
        sendUserTimeoutLogs: boolean,
        sendUserKickLogs: boolean,
        sendUserBanLogs: boolean,
        sendUserUnbanLogs: boolean
    }
}

export enum SettingType {
    Boolean,
    Channel
}

type NewValueType<T,V> = {
    [P in keyof T]: T[P] extends Record<string,unknown> ? NewValueType<T[P],V> : V
}

export const types: NewValueType<GuildSettings, SettingType> = {
    modlog: {
        enabled: SettingType.Boolean,
        channel: SettingType.Channel,
        sendMessageMassDeleteLogs: SettingType.Boolean,
        sendMessageDeleteLogs: SettingType.Boolean,
        sendMessagePurgeLogs: SettingType.Boolean,
        sendMessageEditLogs: SettingType.Boolean,
        sendUserWarningLogs: SettingType.Boolean,
        sendUserTimeoutLogs: SettingType.Boolean,
        sendUserKickLogs: SettingType.Boolean,
        sendUserBanLogs: SettingType.Boolean,
        sendUserUnbanLogs: SettingType.Boolean
    }
};

export const settings = [];
Object.entries(types).map(([k,v]) => {
    for (const i in Object.keys(v)) {
        settings.push(`${k}.${Object.keys(v)[i]}`);
    }
});

type Setting = typeof settings[number];

export const typeText: Record<SettingType, string> = {
    [SettingType.Boolean]: "true/false",
    [SettingType.Channel]: "text channel"
};

export async function getSettingValue<T>(id: Snowflake, setting: Setting): Promise<T | null> {
    const guild = await getGuild(id), sindex = setting.split(".");
    return guild.settings[sindex[0]][sindex[1]];
}

export function getSettingType(setting: Setting): SettingType | null {
    const sindex = setting.split(".");
    return types[sindex[0]][sindex[1]];
}

export async function setSetting(id: Snowflake, setting: Setting, value: unknown): Promise<void> {
    const guild = await getGuild(id), sindex = setting.split(".");
    guild.settings[sindex[0]][sindex[1]] = value;
    updateGuild(id,guild);
}
