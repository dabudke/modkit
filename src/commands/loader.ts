import { ApplicationCommandOptionData, CommandInteraction, Interaction, Snowflake } from "discord.js";
import { readdirSync } from "fs";

export interface Command {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[]
    handler(interaction: Interaction): void;
}

export interface CommandDataObj extends Command {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    handler(interacton: CommandInteraction): void;

    id: Snowflake;
}

export const CommandData: CommandDataObj[] = [];

readdirSync(__dirname).forEach(async file => {
    if (file === __filename.split(/[\\/]/g).pop()) return;
    if (file.endsWith(".map")) return;

    const data: Partial<CommandDataObj> = {};
    data.name = file.slice(0,file.indexOf(".js"));

    const importedData = await import(__dirname + "/" + file);

    data.description = importedData.description;
    data.options = importedData.options;
    data.handler = importedData.handler;

    CommandData.push(data as Required<CommandDataObj>);
});
