const about = require('../meta/about.json');

exports.execute = ( message ) => {
    message.reply('pong!');
}

exports.helpEmbed = ( message ) => {
	return({
		title: `${about.prefix}ping`,
		description: `Ping the bot.`,
		url: "https://allydiscord.github.io/docs/commands/utility/ping/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${about.name} v${about.version}`,
			icon_url: message.author.avatarURL()
		}
	})
}