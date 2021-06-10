import { prefix } from "../meta/about";
import { HelpEmbeds } from "../meta/embeds";

export function execute ( message ) {
    message.reply('pong!');
}

export const helpEmbed: HelpEmbeds = [
	{
		title: `${prefix}ping`,
		description: "Ping the bot.  (pong!)",
		url: "https://allydiscord.github.io/docs/commands/other/ping/"
	}
]