import { readFileSync, writeFileSync, existsSync } from "fs";
import { Setting, SettingValues } from "../utils/settingManager";
import { Punishment, PunishmentId } from "../utils/punishmentManager";
import { UserId, GuildId, RoleId } from "../main";
import { dbpath } from "../meta/config";

//#region Read/Write
enum DataType {
    Map
}

function replacer(k, v) {
    if (v instanceof Map) {
        return {
            dataType: DataType.Map,
            value: Array.from(v.entries())
        };
    }
    return v;
}

function reviver (k, v) {
    if ( typeof v === "object" && v !== null ) {
        if (v.dataType == DataType.Map) {
            return new Map(v.value);
        }
    }
    return v;
}

if (!existsSync(dbpath.concat("users.json"))) {
    writeFileSync(dbpath.concat("users.json"), "{}");
    console.warn("It appears the users database was missing.  Please check for data loss, unless this is first time startup.");
}
const userDb: Map<UserId, LocalUser> = new Map(Object.entries(JSON.parse(readFileSync("./js/databases/users.json", "utf-8"), reviver)));
if (!existsSync(dbpath.concat('guilds.json'))) {
    writeFileSync(dbpath.concat("guilds.json"), "{}");
    console.warn("It appears the guilds database was missing.  Please check for data loss, unless this is first time startup.");
}
const guildDb: Map<GuildId, LocalGuild> = JSON.parse(readFileSync("./js/databases/guilds.json", "utf-8"), reviver);

function saveUserDatabase() { //FIXME Dirty fix for correct database paths, have to do more research to figure this out.
    const db = JSON.stringify(userDb, replacer);
    writeFileSync("./js/databases/users.json", db);
}

function saveGuildDatabase() {
    const db = JSON.stringify(guildDb, replacer);
    writeFileSync("./js/databases/guilds.json", db);
}
//#endregion Read/Write

export type PermIndex = number;

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
        totalBans: number
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
        syncPunishments: Setting,
        muteRole: Setting,
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
    points: Map<UserId, {level: number, points: number, lastUpdated: number}>,
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
        totalBans: 0
    }
}

const DefaultGuild: LocalGuild = {
    settings: {
        pointNotificationChannel: {
            description: "Channel to post point-related notifications to.",
            allowedValues: SettingValues.TextChannelorSame,
            value: "same"
        },
        announcementChannel: {
            description: "Channel to post announcements to using the `announce` command.",
            allowedValues: SettingValues.TextChannel,
            value: null
        },
        usermodNotificationChannel: {
            description: "Channel to post user-facing user changes to (i.e. joins, leaves, nick changes)",
            allowedValues: SettingValues.TextChannel,
            value: null
        },
        userAddNotification: {
            description: "Post users joining to `usermodNotificationChannel`",
            allowedValues: SettingValues.Boolean,
            value: false
        },
        userLeaveNotification: {
            description: "Post users leaving to `usermodNotificationChannel`",
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
            allowedValues: SettingValues.TextChannel,
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
        },
        syncPunishments: {
            description: "Sync local punishments to global Ally database, assisting with other moderators",
            allowedValues: SettingValues.Boolean,
            value: true
        },
        muteRole: {
            description: "Role to be assigned to users using the `mute` command",
            allowedValues: SettingValues.Role,
            value: null
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
    } else {
        return createUser(userid);
    }
}

export function createUser (userid: UserId): LocalUser {
    userDb.set(userid, DefaultUser);
    saveUserDatabase();
    return DefaultUser;
}

export function updateLocalUser (userid: UserId, newuser: LocalUser): void {
    userDb.set(userid, newuser);
    saveUserDatabase();
}

export function deleteLocalUser (userid: UserId): void {
    userDb.delete(userid);
    saveUserDatabase();
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
    saveGuildDatabase();
    return DefaultGuild;
}

export function updateLocalGuild (guildid: GuildId, newguild: LocalGuild): void {
    guildDb.set(guildid, newguild);
    saveGuildDatabase();
}

export function deleteLocalGuild (guildid: GuildId): void {
    guildDb.delete(guildid);
    saveGuildDatabase();
}
//#endregion Guild Functions
//#endregion Functions
