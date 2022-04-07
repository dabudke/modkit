import { ApplicationCommandData, MessageContextMenuInteraction } from "discord.js";
import { readdirSync } from "fs";

export const CommandData: Record<string, ApplicationCommandData> = {};
export const CommandHandlers: Record<string, (interaction: MessageContextMenuInteraction) => void> = {};

readdirSync(__dirname).forEach(async file => {
    if (file === __filename.split(/[\\/]/g).pop()) return;
    if (!file.endsWith(".js")) return;

    const data = await import(__dirname + "/" + file);
    const name = data.data.name;

    CommandData[name] = data.data;
    CommandHandlers[name] = data.handler;
});
