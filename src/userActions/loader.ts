import { UserApplicationCommandData, UserContextMenuInteraction } from "discord.js";
import { readdirSync } from "fs";

export const CommandData: Record<string, UserApplicationCommandData> = {};
export const CommandHandlers: Record<string, (interaction: UserContextMenuInteraction) => void> = {};

readdirSync(__dirname).forEach(async file => {
    if (file === __filename.split(/[\\/]/g).pop()) return;
    if (!file.endsWith(".js")) return;

    const data = await import(__dirname + "/" + file);
    const name = data.data.name;

    CommandData[name] = data.data;
    CommandHandlers[name] = data.handler;
});
