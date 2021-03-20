import { readFileSync, writeFileSync } from "fs";

const userDb: Map<UserId, LocalUser> = JSON.parse(readFileSync("./users.json", "utf-8"));
const guildDb: Map<GuildId, LocalGuild> = JSON.parse(readFileSync("./guilds.json", "utf-8"));

function saveDatabases() {
    writeFileSync("./users.json", JSON.stringify(userDb, null, 2));
    writeFileSync("./guilds.json", JSON.stringify(guildDb, null, 2));
}

//#region Types
type GuildId = string;
type ChannelId = string;
type RoleId = string;
type UserId = string;
type PermIndex = number;

/* TODO move to central punishments manager */
enum Punishments {
    Warning,
    Mute,
    Kick,
    Ban
}
type PunishmentId = number;
interface Punishment {
    type: Punishments,
    user: UserId,
    reason: string,
    endDate?: Date,
};
//#endregion Types

//#region Interfaces
interface LocalUser {
    points: {
        global: {
            level: number,
            points: number
        },
        guilds: Map<GuildId, {level: number, points: number}> | null,
    },
    settings: {
        globalLevelUpMessage: boolean,
        modActionMessage: boolean
    },
    modHistory: {
        warnings: number,
        activeMutes: number,
        totalMutes: number,
        kicks: number,
        activeBans: number,
        totalBans: number,
        permBans: number
    }
}

interface LocalGuild {
    settings: {
        pointNotificationChannel: ChannelId | "same" | null,
        announcementChannel: ChannelId | null,
        usermodNotificationChannel: ChannelId | null,
        userAddNotification: boolean,
        userLeaveNotification: boolean,
        userNickChangeNotification: boolean,
        modLogChannel: ChannelId | null,
        logMessageDelete: boolean,
        logMessageMassDelete: boolean,
        logMessageEdits: boolean,
        logUserWarns: boolean,
        logUserMutes: boolean,
        logUserUnmutes: boolean,
        logUserKicks: boolean,
        logUserBans: boolean,
        logUserUnbans: boolean,
        logUserHistoryClears: boolean,
    },
    permissions: {
        tiers: Array<RoleId?>,
        delete: PermIndex,
        warn: PermIndex,
        mute: PermIndex,
        kick: PermIndex,
        ban: PermIndex,
        viewHistory: PermIndex,
        clearHistory: PermIndex,
        settings: PermIndex
    },
    modHistory: Array<Punishment> | null,
    userModHistory: Map<UserId, Array<PunishmentId>> | null,
    activePunishments: Array<PunishmentId> | null
}
//#endregion Interfaces

//#region Defaults
const DefaultUser: LocalUser = {
    points: {
        global: {
            level: 1,
            points: 0
        },
        guilds: null
    },
    settings: {
        globalLevelUpMessage: true,
        modActionMessage: true
    },
    modHistory: {
        warnings: 0,
        activeMutes: 0,
        totalMutes: 0,
        kicks: 0,
        activeBans: 0,
        totalBans: 0,
        permBans: 0
    }
}

const DefaultGuild: LocalGuild = {
    settings: {
        pointNotificationChannel: "same",
        announcementChannel: null,
        usermodNotificationChannel: null,
        userAddNotification: false,
        userLeaveNotification: false,
        userNickChangeNotification: false,
        modLogChannel: null,
        logMessageDelete: false,
        logMessageMassDelete: false,
        logMessageEdits: false,
        logUserWarns: false,
        logUserMutes: false,
        logUserUnmutes: false,
        logUserKicks: false,
        logUserBans: false,
        logUserUnbans: false,
        logUserHistoryClears: false
    },
    permissions: {
        tiers: [],
        delete: 1,
        warn: 1,
        mute: 1,
        kick: 1,
        ban: 1,
        viewHistory: 1,
        clearHistory: 1,
        settings: 1
    },
    modHistory: null,
    userModHistory: null,
    activePunishments: null
}
//#endregion Defaults

//#region Functions
//#region User Functions
export function getLocalUser (userid: UserId): LocalUser | false {
    if (userDb.has(userid)) {
        return userDb.get(userid);
    }
    return false;
}

export function createUser (userid: UserId): void {
    userDb.set(userid, DefaultUser);
    saveDatabases();
}

export function updateLocalUser (userid: UserId, newuser: LocalUser): void {
    userDb.set(userid, newuser);
    saveDatabases();
}

export function deleteLocalUser (userid: UserId): void {
    userDb.delete(userid);
    saveDatabases();
}
//#endregion User Functions

//#region Guild Functions
export function getLocalGuild (guildid: GuildId): LocalGuild | false {
    if (guildDb.has(guildid)) {
        return guildDb.get(guildid);
    }

    return false;
}

export function createLocalGuild (guildid: GuildId): void {
    guildDb.set(guildid, DefaultGuild);
    saveDatabases();
}

export function updateLocalGuild (guildid: GuildId, newguild: LocalGuild): void {
    guildDb.set(guildid, newguild);
    saveDatabases();
}

export function deleteLocalGuild (guildid: GuildId): void {
    guildDb.delete(guildid);
    saveDatabases();
}
//#endregion Guild Functions
//#endregion Functions
