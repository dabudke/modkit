import { readFileSync, writeFileSync, existsSync } from "fs";
import { Setting, SettingValues } from "../utils/settingManager";
import { Punishment, PunishmentId } from "../utils/punishmentManager";
import { Snowflake } from "discord.js";

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

class Database<K extends string, V> {
    public name: string;
    public readonly default: V;

    protected file: string;
    protected store: Map<K, V>;
    
    constructor(name: string, defaultValue: V) {
        this.name = name;
        this.default = defaultValue;
        this.file = "./".concat(name, ".json");
        if (!existsSync(this.file)) {
            console.warn(`Database file ${this.file} does not exist.  Writing blank database before continuing.`);
            try {
                writeFileSync(this.file, JSON.stringify(new Map(), replacer));
            } catch (e) {
                console.error(`Could not write to database ${this.file}!\n${e}`);
            }
        }
        try {
            this.store = JSON.parse(readFileSync(this.file, "utf-8"), reviver);
        } catch (e) {
            console.warn(`Could not read database ${this.file}!  Using blank database.\n${e}`);
            this.store = JSON.parse(JSON.stringify(new Map(), replacer), reviver);
        }
    }

    protected verify(key: K): void {
        if (!this.store.has(key)) {
            this.store.set(key, this.default);
        }
    }
    
    public get(key: K): V {
        this.verify(key);
        return this.store.get(key);
    }

    public update(key: K, value: V): void {
        this.verify(key);
        this.store.set(key, value);
    }

    public delete(key: K): void {
        this.store.delete(key);
    }

    public save(): boolean {
        try {
            writeFileSync(this.file, JSON.stringify(this.store, replacer));
            return true;
        } catch (e) {
            console.error(`Could not write database file ${this.file}!\n${e}`);
            return false;
        }
    }
}

export type PermIndex = number;

export interface LocalUser {
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

export interface LocalGuild {
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
        tiers: Array<Snowflake>,
        delete: PermIndex,
        warn: PermIndex,
        mute: PermIndex,
        kick: PermIndex,
        ban: PermIndex,
        viewHistory: PermIndex,
        clearHistory: PermIndex,
        settings: PermIndex
    },
    points: Map<Snowflake, {level: number, points: number, lastUpdated: number}>,
    modHistory: Array<Punishment>,
    userModHistory: Map<Snowflake, Array<PunishmentId>>,
    activePunishments: Array<PunishmentId>
}

export const DefaultUser: LocalUser = {
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
};

export const DefaultGuild: LocalGuild = {
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
};

export const UserDb: Database<Snowflake, LocalUser> = new Database("users", DefaultUser);
export const GuildDb: Database<Snowflake, LocalGuild> = new Database("guilds", DefaultGuild);

function saveDatabases() {
    let fail = 0;
    console.log("Saving databases...");
    if (!UserDb.save()) fail++;
    if (!GuildDb.save()) fail++;
    console.log(`Databases saved.  ${fail} failiures.`);
}

const saveInterval = setInterval(saveDatabases, 300000);
process.on("exit", () => {
    clearInterval(saveInterval);
    saveDatabases();
});
