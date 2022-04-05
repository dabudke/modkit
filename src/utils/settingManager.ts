import { GuildResolvable, RoleResolvable, Snowflake, TextChannelResolvable } from "discord.js";
import { GuildDb, DefaultGuild } from "../databases/manager";

export enum SettingValues {
    TextChannel = "Text Channel",
    Boolean = "`yes`, `no`",
    Role = "Role"
}

interface PureSetting {
    readonly description: string,
    readonly type: SettingValues
    value: unknown
}

abstract class Setting implements PureSetting {
    public readonly description: string;
    public readonly type: SettingValues;
    public value: unknown;

    constructor(setting: PureSetting) {
        this.description = setting.description;
        this.type = setting.type;
        this.value = setting.value;
    }

    isTextChannel(): this is TextChannelSetting {
        return this.type == SettingValues.TextChannel;
    }
    isBoolean(): this is BooleanSetting {
        return this.type == SettingValues.Boolean;
    }
    isRole(): this is RoleSetting {
        return this.type == SettingValues.Role;
    }
}

export class TextChannelSetting extends Setting {
    public value: TextChannelResolvable | null
}
export class BooleanSetting extends Setting {
    public value: boolean;
}
export class RoleSetting extends Setting {
    public value: RoleResolvable | null;
}

export function settingValid( setting: string ): boolean {
    return DefaultGuild.settings[setting] != undefined;
}

export async function getSetting( guildid: Snowflake, setting: string ): Promise<Setting> {
    if (!settingValid(setting)) {
        return Promise.reject("That setting does not exist!");
    }
    const guild = GuildDb.get(guildid);
    return Promise.resolve(guild.settings[setting]);
}

// export async function setValue( guildid: GuildResolvable, setting: string, value: unknown ): Promise<boolean> {
//     if (!settingValid(setting)) return Promise.reject("That setting does not exist!");
//     if ()
// }
