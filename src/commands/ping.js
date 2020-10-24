const pfx = require("../../meta/about.json").prefix;
const nme = require("../../meta/about.json").name;
const vrs = require("../../meta/about.json").version;

exports.execute = ( client, msg ) => {
    msg.reply('pong!');
}

exports.helpEmbed = message => {
	return({
		title: `${pfx}ping`,
		description: `Ping the bot.`,
		url: "https://allydiscord.github.io/docs/commands/utility/ping/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${nme} v${vrs}`,
			icon_url: message.author.avatarURL()
		}
	})
}