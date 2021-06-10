import { readFileSync, writeFileSync, existsSync } from "fs";

if (!existsSync("./js/databases/users.json")) {
    writeFileSync("./js/databases/users.json", "{}");
    console.warn("It appears the users database was missing.  Please check for data loss, unless this is first time startup.");
}
const userDb: Map<UserId, LocalUser> = new Map(Object.entries(JSON.parse(readFileSync("./js/databases/users.json", "utf-8"))));
if (!existsSync('./js/databases/guilds.json')) {
    writeFileSync("./js/databases/guilds.json", "{}");
    console.warn("It appears the guilds database was missing.  Please check for data loss, unless this is first time startup.");
}
const guildDb: Map<GuildId, LocalGuild> = new Map(Object.entries(JSON.parse(readFileSync("./js/databases/guilds.json", "utf-8"))));

function saveDatabases() { //FIXME Dirty fix for correct database paths, have to do more research to figure this out.
    writeFileSync("./js/databases/users.json", JSON.stringify(Object.fromEntries(userDb), null, 2));
    writeFileSync("./js/databases/guilds.json", JSON.stringify(Object.fromEntries(guildDb), null, 2));
}

//#region Types
export type PermIndex = number;

/* Probably should move these to main script. */
export type GuildId = string;
export type ChannelId = string;
export type RoleId = string;
export type UserId = string;

export enum SettingValues {
    ChannelOrSame = "Channel, `same`",
    Channel = "Channel",
    Boolean = "`yes`, `no`"
}

interface Setting {
    description: string,
    allowedValues: SettingValues,
    value: any
}

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
        level: number,
        points: number
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
        pointNotificationChannel: Setting,
        announcementChannel: Setting,
        usermodNotificationChannel: Setting,
        userAddNotification: Setting,
        userLeaveNotification: Setting,
        userNickChangeNotification: Setting,
        modLogChannel: Setting,
        logMessageDelete: Setting,
        logMessageMassDelete: Setting,
        logMessageEdits: Setting,
        logUserWarns: Setting,
        logUserMutes: Setting,
        logUserUnmutes: Setting,
        logUserKicks: Setting,
        logUserBans: Setting,
        logUserUnbans: Setting,
        logUserHistoryClears: Setting,
    },
    permissions: {
        tiers: Array<RoleId>,
        delete: PermIndex,
        warn: PermIndex,
        mute: PermIndex,
        kick: PermIndex,
        ban: PermIndex,
        viewHistory: PermIndex,
        clearHistory: PermIndex,
        settings: PermIndex
    },
    points: Map<UserId, {level: number, points: number}>,
    modHistory: Array<Punishment>,
    userModHistory: Map<UserId, Array<PunishmentId>>,
    activePunishments: Array<PunishmentId>
}
//#endregion Interfaces

//#region Defaults
const DefaultUser: LocalUser = {
    points: {
        level: 1,
        points: 0
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
        pointNotificationChannel: {
            description: "Channel to post point-related notifications to.",
            allowedValues: SettingValues.ChannelOrSame,
            value: null
        },
        announcementChannel: {
            description: "Channel to post announcements to using the `announce` command.",
            allowedValues: SettingValues.Channel,
            value: null
        },
        usermodNotificationChannel: {
            description: "Channel to post user-facing user changes to (i.e. joins, leaves, nick changes)",
            allowedValues: SettingValues.Channel,
            value: null
        },
        userAddNotification: {
            description: "Post users joining to `usermodNotificationChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        userLeaveNotification: {
            description: "Post users leaving to `usermodNotificatoinChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        userNickChangeNotification: {
            description: "Post users changing their nicknames to `usermodNotificationChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        modLogChannel: {
            description: "Channel to post moderator-facing logs to (i.e. kicks, bans, mutes, message modifications",
            allowedValues: SettingValues.Channel,
            value: null
        },
        logMessageDelete: {
            description: "Post message deletes to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logMessageMassDelete: {
            description: "Post message mass deletes to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logMessageEdits: {
            description: "Post message edits to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logUserWarns: {
            description: "Post user warnings to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logUserMutes: {
            description: "Post user mutes to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logUserUnmutes: {
            description: "Post user unmutes (including automatic unmutes) to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logUserKicks: {
            description: "Post user kicks to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logUserBans: {
            description: "Post user bans to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logUserUnbans: {
            description: "Post user unbans (including automatic unbans) to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        logUserHistoryClears: {
            description: "Post user moderation history clears to `modLogChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        }
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
    points: new Map(),
    modHistory: [],
    userModHistory: new Map(),
    activePunishments: []
}
//#endregion Defaults

//#region Functions
//#region User Functions
export function getLocalUser (userid: UserId): LocalUser {
    if (userDb.has(userid)) {
        return userDb.get(userid);
    }
}

export function createUser (userid: UserId): LocalUser {
    userDb.set(userid, DefaultUser);
    saveDatabases();
    return DefaultUser;
}

export function updateLocalUser (userid: UserId, newuser: LocalUser) {
    userDb.set(userid, newuser);
    saveDatabases();
}

export function deleteLocalUser (userid: UserId) {
    userDb.delete(userid);
    saveDatabases();
}
//#endregion User Functions

//#region Guild Functions
export function getLocalGuild (guildid: GuildId): LocalGuild {
    if (guildDb.has(guildid)) {
        return guildDb.get(guildid);
    }
}

export function createLocalGuild (guildid: GuildId): LocalGuild {
    guildDb.set(guildid, DefaultGuild);
    saveDatabases();
    return DefaultGuild;
}

export function updateLocalGuild (guildid: GuildId, newguild: LocalGuild) {
    guildDb.set(guildid, newguild);
    saveDatabases();
}

export function deleteLocalGuild (guildid: GuildId) {
    guildDb.delete(guildid);
    saveDatabases();
}
//#endregion Guild Functions
//#endregion Functions
