import { Guild, GuildMember } from "discord.js";
import { getLocalGuild, PermIndex } from "../databases/manager";

export enum Actions {
    DeleteMessages = "delete",
    WarnUser = "warn",
    KickUser = "kick",
    BanAction = "ban",
    MuteAction = "mute",
    ViewHistory = "viewHistory",
    ClearHistory = "clearHistory",
    Settings = "settings"
}

export function hasPermission ( guild: Guild, guildUser: GuildMember, command: Actions): boolean {
    const CurrentGuild = getLocalGuild(guild.id);

    if (!CurrentGuild) return false;

    const PermissionTiers = CurrentGuild.permissions.tiers;
    const NeededPerm: PermIndex = CurrentGuild.permissions[command];

    if (guildUser.permissions.has("ADMINISTRATOR")) return true;

    if (PermissionTiers) {
        PermissionTiers.forEach((id, index) => {
            if (index < NeededPerm) return;
            if (!guild.roles.resolve(id)) return;
            if (!guildUser.roles.cache.has(id)) return;
    
            return true;
        });
    }

    return false;
}
