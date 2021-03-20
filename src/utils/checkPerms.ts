import { Guild, GuildMember } from "discord.js";
import * as db from "../databases/manager";

export enum Commands {
    DeleteMessages = "delete",
    WarnUser = "warn",
    KickUser = "kick",
    BanAction = "ban",
    MuteAction = "mute",
    ViewHistory = "viewHistory",
    ClearHistory = "clearHistory",
    EditSettings = "settings"
}

export function hasPermission ( guild: Guild, guildUser: GuildMember, command: Commands): boolean {
    const CurrentGuild = db.getLocalGuild(guild.id);

    if (!CurrentGuild) return false;

    const PermissionTiers = CurrentGuild.permissions.tiers;
    const NeededPerm: db.PermIndex = CurrentGuild.permissions[command];
    let hasNeededPerm = false;

    PermissionTiers.forEach((id, index) => {
        if (index < NeededPerm) return;
        if (!guild.roles.resolve(id)) return;
        if (!guildUser.roles.cache.has(id)) return;

        hasNeededPerm = true;
    })

    return hasNeededPerm;
}
