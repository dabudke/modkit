import { getLocalGuild, updateLocalGuild } from "../databases/manager";
import { GuildId } from "../main";

export enum SettingValues {
    TextChannelorSame = "Text Channel, `same`",
    TextChannel = "Text Channel",
    Boolean = "`yes`, `no`",
    Role = "Role"
}

export interface Setting {
    description: string,
    allowedValues: SettingValues,
    value: unknown
}

export function getSetting ( guild: GuildId, setting: string ): Setting | undefined {
    const LGuild = getLocalGuild(guild);
    return LGuild.settings[setting];
}

export function getSettingValue ( guild: GuildId, setting: string ): unknown {
    const LGuild = getLocalGuild(guild);
    return LGuild.settings[setting].value;
}

export function setSetting ( guild: GuildId, setting: string, value: unknown ): void {
    const LGuild = getLocalGuild(guild);
    LGuild.settings[setting].value = value;
    updateLocalGuild(guild, LGuild);
}
