import { Guild, GuildMember, Permissions, Snowflake } from "discord.js";
import { GuildDb, PermIndex } from "../databases/manager";

export enum Actions {
    Purge = "purge",
    WarnUser = "warn",
    KickUser = "kick",
    BanUser = "ban",
    Mute = "mute",
    ViewHistory = "viewHistory",
    ClearHistory = "clearHistory",
    Settings = "settings"
}

export function hasPermission ( permissions: Permissions, command: Actions): boolean {

    if (permissions.has("ADMINISTRATOR")) return true;

    switch (command) {
        case Actions.WarnUser:
            if (!permissions.has("MODERATE_MEMBERS")) return false;
    }

    return false;
}
