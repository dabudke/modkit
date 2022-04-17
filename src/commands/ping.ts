import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";

export const data: ChatInputApplicationCommandData = {
	name: "ping",
	description: "Ping the bot",
	type: "CHAT_INPUT"
};

export function handler(interaction: CommandInteraction) {
	interaction.reply({ content: `:ping_pong: Pong!\nResponse time: **${(Date.now() - interaction.createdTimestamp).toString()}ms**` });
}
