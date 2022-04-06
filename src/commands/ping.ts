import { ApplicationCommandData, CommandInteraction } from "discord.js";

export const data: ApplicationCommandData = {
	name: "ping",
	description: "Ping the bot"
};

export function handler(interaction: CommandInteraction) {
	interaction.reply({ content: "Pong!", ephemeral: true });
}
