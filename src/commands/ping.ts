import { name, prefix, version } from "../meta/about";

export function execute ( message ) {
    message.reply('pong!');
}

export function helpEmbed ( message ) {
	return({
		title: `${prefix}ping`,
		description: `Ping the bot.`,
		url: "https://allydiscord.github.io/docs/commands/utility/ping/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${name} v${version}`,
			icon_url: message.author.avatarURL()
		}
	})
}