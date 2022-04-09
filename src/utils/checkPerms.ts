import { Guild, Snowflake } from "discord.js";
import { Action } from "./caseManager";

export async function hasPermission ( guild: Guild, userId: Snowflake, command: Action): Promise<boolean> {
    if (guild.ownerId === userId) return true;
    const user = await guild.members.fetch(userId);
    if (user.permissions.has("ADMINISTRATOR")) return true;

    switch (command) {
        case Action.Warn:
            if (user.permissions.has("MODERATE_MEMBERS")) return true;
            break;
        case Action.Purge:
            if (user.permissions.has("MANAGE_MESSAGES")) return true;
            break;
        case Action.ViewCases:
            if (user.permissions.has("VIEW_AUDIT_LOG")) return true;
            break;
        case Action.UpdateCase:
        case Action.ExpungeCase:
            if (user.permissions.has("MANAGE_GUILD")) return true;
            break;
    }

    return false;
}
