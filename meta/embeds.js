/* Template Embed:
{
	title: ``,
	description: ``,
	url: "https://allydiscord.github.io/",
	color: 0x0099FF,
	thumbnail: {
		url: "https://imgur.com/YVRMcUD.png"
	},
	fields: [],
	timestamp: new Date(),
	footer: {
		text: `Requested by {message author} | {bot name} v(non-production)`,
		icon_url: {message profile picture link}
	}
}
*/
const { prefix, name } = require("../meta/about.json");

exports.help = (message) => {
	return ({
		title: "Help",
        description: `Use \`${prefix}help (category)\` to see all commands in category, or use \
${prefix}help (command) to see the usage of a command.`,
		url: "https://allydiscord.github.io/commands/index.html",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
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
		timestamp: new Date(),
        footer: {
			text: `Requested by ${message.author.username} | ${name} v(non-production)`,
			icon_url: message.author.avatarURL()
        }
	});
}

exports.utility = ( message ) => {
    return({
        title: "Utility Commands | Help",
        description: `Use ${prefix}help (command) to see help about a command.`,
        url: "https://allydiscord.github.io/commands/utility.html",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
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
		timestamp: new Date(),
        footer: {
			text: `Requested by ${message.author.username} | ${name} v(non-production)`,
			icon_url: message.author.avatarURL()
        }
    });
}

exports.moderation = (message) => {
	return({
        title: "Moderation Commands | Help",
        description: `Use ${prefix}help (command) to see help about a command.`,
        url: "https://allydiscord.github.io/commands/moderation.html",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
        fields: [
            {
                name: `${prefix}warn/! (user) (reason)`,
				value: "Warn a user for something, such as breaking a rule."
            },
            {
                name: `${prefix}permissions/perms/perm (user|role) (permission) [value]`,
                value: "Manage permissions for a server's roles/users."
            }
		],
		timestamp: new Date(),
        footer: {
			text: `Requested by ${message.author.username} | ${name} v(non-production)`,
			icon_url: message.author.avatarURL()
        }
	})
}