import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";
import { name, url } from "../meta/config";

export const data: ChatInputApplicationCommandData = {
    name: "help",
    description: `Get help with configuring and using ${name}`,
    type: "CHAT_INPUT"
};

export function handler(interaction: CommandInteraction) {
    interaction.reply(`For help with using ${name}, please see the [docs](${url}/docs/)`);
}
