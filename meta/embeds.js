/* Template Embed:
{
    color: 0x0099ff,
	title: 'Some title',
	url: 'https://discord.js.org',
	author: {
		name: 'Some name',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
		url: 'https://discord.js.org',
	},
	description: 'Some description here',
	thumbnail: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	fields: [
		{
			name: 'Regular field title',
			value: 'Some value here',
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
	],
	image: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	timestamp: new Date(),
	footer: {
		text: 'Some footer text here',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
	},
}
*/
const { prefix, name } = require("../meta/about.json");

exports.help = (message) => {
	return ({
		title: "Help",
        description: `Use \`${prefix}help (category)\` to see all commands in category, or use \
${prefix}help (command) to see the usage of a command.`,
		url: "https://allydiscord.github.io/commands/",
        color: 0x0099FF,
		author: {
			name: message.author.name,
			icon_url: message.author.avatarURL(),
			url: message.url
        },
		fields: [
			{
				name: "Moderation",
				value: `${prefix}warn - Warn a user.
${prefix}permissions (${prefix}perms/${prefix}perm) - Manage server permissions`
			},
			{
				name: "Utility",
				value: `${prefix}help (${prefix}?) - Sends this embed.
${prefix}about - Returns information about Ally.
${prefix}settings (${prefix}sets/${prefix}set) - Change server/user settings.
${prefix}feedback (${prefix}fb) - Send feedback to the developers.`
			}
		],
		footer: {
			text: "Ally v(non-production)"
		}
	});
}

exports.utility = ( message ) => {
    return({
        title: "Utility Commands - Help",
        description: `Use ${prefix}help (command) to see help about a command.`,
        url: "allydiscord.github.io/commands/category/utility.html",
        color: 0x0099FF,
        author: {
            name: message.author.name,
            icon_url: message.author.avatarURL(),
            url: message.url
        },
        fields: [
            {
                name: `${prefix}help/? [category|command]`,
                value: "Send an embed that gives information about commands."
            },
            {
                name: `${prefix}about [info]`,
                value: `Send an embed that gives information about ${name}.`
            },
            {
                name: `${prefix}settings/sets/set (user|server) (setting) [value]`,
                value: "Change settings for yourself or the current server."
            },
            {
                name: `${prefix}feedback/fb (feedback)`,
                value: `Send feedback to the developers of ${name}.`
            }
        ],
        footer: {
            name: `${name} v(non-production)`
        }
    })
}