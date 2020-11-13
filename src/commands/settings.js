const about = require("../meta/about.json");
const databases = require("../utils/databaseManager");

exports.execute = ( msg, args ) => {
    // check permissions
    var perms = databases.serverDb.default.settings.moderation.permissions;
    if ( !msg.guild.members.cache.get(msg.author.id).roles.cache.get( perms.modRoles[perms.viewSettings] ) ) {
        if ( !msg.guild.members.cache.get(msg.author.id).hasPermission("MANAGE_GUILD") ) {
            msg.reply("you do not have permission to use that command.");
            return;
        }
    }

    // parse setting
    let setting = args[0] ? args[0].split(/\./g) : [];
    let dbObj = databases.serverDb[msg.guild.id].settings;
    for ( var i in setting ) {
        if ( !dbObj[setting[i]] ) {
            msg.reply("that setting does not exist.");
            return;
        } else {
            dbObj = dbObj[setting[i]];
        }
    }
}

exports.helpEmbed = ( message ) => {
    return({
		title: `${about.prefix}settings (scope) (setting) [value]`,
		description: `Manage settings for yourself or the server.`,
		url: "https://allydiscord.github.io/docs/commands/utility/settings/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [
			{
				name: "scope - Scope of setting.",
				value: "**Required.**  Choose whether to manage settings for yourself or the server."
			},
			{
				name: "permission - Setting to manage.",
				value: "**Optional.**  Omit to see all settings and their values."
			},
			{
				name: "value - Value to set the setting to.",
				value: "**Optional.**  Omit to see the value of the setting."
			},
			{
				name: "Alternate Commands:",
				value: `${about.prefix}setting, ${about.prefix}sets, ${about.prefix}set`
			}
		],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${about.name} v${about.version}`,
			icon_url: message.author.avatarURL()
		}
	});
}
