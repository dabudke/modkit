import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { readdirSync } from "fs";

export const CommandData: Record<string, ApplicationCommandData> = {};
export const CommandHandlers: Record<string, (interaction: CommandInteraction) => void> = {};

readdirSync(__dirname).forEach(async file => {
    if (file === __filename.split(/[\\/]/g).pop()) return;
    if (!file.endsWith(".js")) return;

    const data = await import(__dirname + "/" + file);
    const name = file.slice(0, file.indexOf(".js"));

    CommandData[name] = data.data;
    CommandHandlers[name] = data.handler;
});
