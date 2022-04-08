import { Guild, Snowflake } from "discord.js";
import { Action } from "./caseManager";

export async function hasPermission ( guild: Guild, userId: Snowflake, command: Action): Promise<boolean> {
    if (guild.ownerId === userId) return true;
    const user = await guild.members.fetch(userId);
    if (user.permissions.has("ADMINISTRATOR")) return true;

    switch (command) {
        case Action.Warn:
            if (!user.permissions.has("MODERATE_MEMBERS")) return false;
            break;
        case Action.Purge:
            if (!user.permissions.has("MANAGE_MESSAGES")) return false;
            break;
        default:
            return false;
    }
}
