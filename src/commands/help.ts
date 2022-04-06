import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { name, url } from "../meta/config";

export const data: ApplicationCommandData = {
    name: "help",
    description: `Get help with configuring and using ${name}`
};

export function handler(interaction: CommandInteraction) {
    interaction.reply(`For help with using ${name}, please see the [docs](${url}/docs/)`);
}
