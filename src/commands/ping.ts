import { HelpEmbeds } from "../meta/embeds";

export function handle ( message ) {
    message.reply('pong!');
}

export const helpEmbed: HelpEmbeds = [
	{
		title: `ping`,
		description: "Ping the bot.  (pong!)",
		url: "/docs/commands/other/ping/"
	}
]