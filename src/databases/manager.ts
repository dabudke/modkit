import { readFileSync, writeFileSync, existsSync } from "fs";
import { BooleanSetting, RoleSetting, SettingValues, TextChannelSetting } from "../utils/settingManager";
import { CaseData, CaseId } from "../utils/caseManager";
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
        this.file = __dirname.concat("/").concat(name, ".json");
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
        usermodNotificationChannel: TextChannelSetting,
        userAddNotification: BooleanSetting,
        userLeaveNotification: BooleanSetting,
        userNickChangeNotification: BooleanSetting,
        modLogChannel: TextChannelSetting,
        logMessageDelete: BooleanSetting,
        logMessageMassDelete: BooleanSetting,
        logMessageEdits: BooleanSetting,
        logUserWarns: BooleanSetting,
        logUserMutes: BooleanSetting,
        logUserUnmutes: BooleanSetting,
        logUserKicks: BooleanSetting,
        logUserBans: BooleanSetting,
        logUserUnbans: BooleanSetting,
        muteRole: RoleSetting,
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
    modHistory: Array<CaseData>,
    userModHistory: Map<Snowflake, Array<CaseId>>,
    activePunishments: Array<CaseId>
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
        usermodNotificationChannel: new TextChannelSetting({
            description: "Channel to post user-facing user changes to (i.e. joins, leaves, nick changes)",
            type: SettingValues.TextChannel,
            value: null
        }),
        userAddNotification: new BooleanSetting({
            description: "Post users joining to `usermodNotificationChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        userLeaveNotification: new BooleanSetting({
            description: "Post users leaving to `usermodNotificationChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        userNickChangeNotification: new BooleanSetting({
            description: "Post users changing their nicknames to `usermodNotificationChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        modLogChannel: new TextChannelSetting({
            description: "Channel to post moderator-facing logs to (i.e. kicks, bans, mutes, message modifications)",
            type: SettingValues.TextChannel,
            value: null
        }),
        logMessageDelete: new BooleanSetting({
            description: "Post message deletes to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        logMessageMassDelete: new BooleanSetting({
            description: "Post message mass deletes to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        logMessageEdits: new BooleanSetting({
            description: "Post message edits to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        logUserWarns: new BooleanSetting({
            description: "Post user warnings to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        logUserMutes: new BooleanSetting({
            description: "Post user mutes to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        logUserUnmutes: new BooleanSetting({
            description: "Post user unmutes (including automatic unmutes) to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        logUserKicks: new BooleanSetting({
            description: "Post user kicks to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        logUserBans: new BooleanSetting({
            description: "Post user bans to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        logUserUnbans: new BooleanSetting({
            description: "Post user unbans (including automatic unbans) to `modLogChannel`",
            type: SettingValues.Boolean,
            value: false
        }),
        muteRole: new RoleSetting({
            description: "Role to be assigned to users using the `mute` command",
            type: SettingValues.Role,
            value: null
        })
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
