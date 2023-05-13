import { Guild, Snowflake } from "discord.js";
import { SubActionType, MessageActionType, UserActionType } from "../dataManagers/caseManager";

export enum PermAction {
    ViewCase,
    UpdateCase,
    ManageSettings
}

export async function hasPermission ( guild: Guild, userId: Snowflake, command: SubActionType | PermAction): Promise<boolean> {
    if (guild.ownerId === userId) return true;
    const user = await guild.members.fetch(userId);
    if (user.permissions.has("ADMINISTRATOR")) return true;

    switch (command) {
        case UserActionType.Warn:
            if (user.permissions.has("MODERATE_MEMBERS")) return true;
            break;
        case MessageActionType.Purge:
            if (user.permissions.has("MANAGE_MESSAGES")) return true;
            break;
        case PermAction.ViewCase:
            if (user.permissions.has("VIEW_AUDIT_LOG")) return true;
            break;
        case PermAction.UpdateCase:
        case PermAction.ManageSettings:
            if (user.permissions.has("MANAGE_GUILD")) return true;
            break;
    }

    return false;
}
