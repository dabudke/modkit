import { CommandInteraction } from "discord.js";

export const description = "Ping the bot.";

export function handler(interaction: CommandInteraction) {
	interaction.reply({ content: "Pong!" });
}
