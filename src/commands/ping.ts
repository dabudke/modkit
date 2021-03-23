import { MessageEmbed } from "discord.js";
import { prefix } from "../meta/about";

export function execute ( message ) {
    message.reply('pong!');
}

export function helpEmbed (): MessageEmbed {
	var embed = new MessageEmbed();
	embed.setTitle(`${prefix}ping`);
	embed.setDescription("Pings the bot.");
	embed.setURL("https://allydiscord.github.io/docs/commands/utility/help/");
	return embed;
}