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
		text: `Requested by {message author} | {bot name} v{version}`,
		icon_url: {message profile picture link}
	}
}
*/
const { prefix: pfx, name: nme, version: vrs } = require("./about.json");

exports.help = message => {
	return ({
		title: "Help",
        description: `Use \`${pfx}help (category)\` to see all commands in category, or use \
${pfx}help (command) to see the usage of a command.`,
		url: "https://allydiscord.github.io/docs/commands/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [
			{
				name: "Moderation",
				value: `${pfx}warn - Warn a user.
${pfx}permissions (${pfx}perms/${pfx}perm) - Manage server permissions`
			},
			{
				name: "Utility",
				value: `${pfx}help (${pfx}?) - Sends this embed.
${pfx}about - Returns information about Ally.
${pfx}settings (${pfx}sets/${pfx}set) - Change server/user settings.
+2 commands`
			}
		],
		timestamp: new Date(),
        footer: {
			text: `Requested by ${message.author.username} | ${nme} v${vrs}`,
			icon_url: message.author.avatarURL()
        }
	});
}

exports.utility = message => {
    return({
        title: "Utility Commands | Help",
        description: `Use ${pfx}help (command) to see help about a command.`,
        url: "https://allydiscord.github.io/docs/commands/utility/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
        fields: [
            {
                name: `${pfx}help/? [category|command]`,
				value: "Send an embed that gives information about commands."
            },
            {
                name: `${pfx}about [info]`,
                value: `Send an embed that gives information about ${nme}.`
            },
            {
                name: `${pfx}settings/sets/set (user|server) (setting) [value]`,
                value: "Change settings for yourself or the current server."
            },
            {
                name: `${pfx}feedback (feedback) | ${pfx}fb ...`,
                value: `Send feedback to the developers of ${nme}.`
            }
		],
		timestamp: new Date(),
        footer: {
			text: `Requested by ${message.author.username} | ${nme} v${vrs}`,
			icon_url: message.author.avatarURL()
        }
    });
}

exports.moderation = message => {
	return({
        title: "Moderation Commands | Help",
        description: `Use ${pfx}help (command) to see help about a command.`,
        url: "https://allydiscord.github.io/docs/commands/moderation/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
        fields: [
            {
                name: `${pfx}warn (user) (reason) | ${pfx}! ...`,
				value: "Warn a user for something, such as breaking a rule."
            },
            {
                name: `${pfx}permissions (user|role) (permission) [value] | ${pfx}perms ... | ${pfx}perm ...`,
                value: "Manage permissions for a server's roles/users."
            }
		],
		timestamp: new Date(),
        footer: {
			text: `Requested by ${message.author.username} | ${nme} v${vrs}`,
			icon_url: message.author.avatarURL()
        }
	})
}

exports.command = {}
exports.command.warn = message => {
	return({
		title: `${pfx}warn (user) (reason)`,
		description: `Warn, or strike, a user (mentioned in the command) for a reason (such as breaking a rule).`,
		url: "https://allydiscord.github.io/docs/commands/moderation/warn/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [
			{
				name: `user - User in your Discord server.`,
				value: "**Required.**  The user to warn.  *Must be in the channel the command is run in.*"
			},
			{
				name: `reason - Reason for the strike.`,
				value: `**Required**  The reason for the strike against the user.`
			},
			{
				name: "Alternate Commands:",
				value: `${pfx}?`
			}
		],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.name} | ${nme} v${vrs}`,
			icon_url: message.author.avatarURL()
		}
	})
}

exports.command.permissions = message => {
	return({
		title: `${pfx}permissions (user|role) (permission) [value]`,
		description: `Manage permissions for a user or role.`,
		url: "https://allydiscord.github.io/docs/commands/moderation/permissions/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [
			{
				name: "user|role - User or role in the server.",
				value: "**Required.**  The user or role to manage the permission of."
			},
			{
				name: "permission - Permission to change.",
				value: "**Required.** The permission to change (found at permissions page)"
			},
			{
				name: "value - The value to set the permission to.",
				value: "**Optional.**  Omit to see the value the permission is currently set to."
			},
			{
				name: "Alternate Commands:",
				value: `${pfx}perms, ${pfx}perm`
			}
		],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${nme} v${vrs}`,
			icon_url: message.author.avatarURL()
		}
	})
}

exports.command.help = message => {
	return({
		title: `${pfx}help [command|category]`,
		description: `Get help for different commands, or command categories.`,
		url: "https://allydiscord.github.io/docs/commands/utility/help/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [
			{
				name: "value - The value to set the permission to.",
				value: "**Optional.**  Omit to see the value the permission is currently set to."
			},
			{
				name: "Alternate Command:",
				value: `${pfx}?`
			}
		],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${nme} v${vrs}`,
			icon_url: message.author.avatarURL()
		}
	});
}

exports.command.about = message => {
	return({
		title: `${pfx}about [meta]`,
		description: `Get information about ${nme} and the developers.`,
		url: "https://allydiscord.github.io/docs/commands/utility/about/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [
			{
				name: 'meta - Meta to get information about.',
				value: '**Optional**  Type a category of meta information to get more information on the topic.'
			}
		],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${nme} v${vrs}`,
			icon_url: message.author.avatarURL()
		}
	});
}
