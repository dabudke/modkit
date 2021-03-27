import { MessageEmbed } from "discord.js";
import { name, prefix } from "./about";

export function helpDefault(): MessageEmbed {
    var embed = new MessageEmbed();
    embed.setTitle(`Help - ${name}`);
    embed.setDescription(`Use \`${prefix}help\` and include a category/command to see all commands in that category or how to use that command.`);
    embed.setURL("https://allydiscord.github.io/docs/commands/");
    embed.addFields([{
        name: "Moderation Commands",
        value: `${prefix}warn (${prefix}!) - Warn a user.\n${prefix}ban (${prefix}tempban) - Ban a user\n${prefix}mute (${prefix}tempmute) - Mute a user.\n**+4 more**`
    }, {
        name: "Utility Commands",
        value: `${prefix}help (${prefix}?) - Provides documentation without leaving Discord\n${prefix}settings (${prefix}setting, ${prefix}sets, ${prefix}set) - Change settings for current guild.\n${prefix}usersettings (${prefix}usersetting, ${prefix}usersets, ${prefix}userset) - Manage your personal settings.\n**+3 more**`
    }, {
        name: "Leveling Commands",
        value: `${prefix}level (${prefix}lvl) - Displays the level for yourself or other users.\n${prefix}setlevel (${prefix}setlvl) - Sets the server level for yourself or another user.\n${prefix}globallevel (${prefix}globallvl, ${prefix}glevel, ${prefix}glvl) - Displays your global level.`
    }, {
        name: "Other Commands",
        value: `${prefix}about - Displays information about ${name}.\n${prefix}feedback (${prefix}fb) - Provide feedback to the developers of Ally.\n${prefix}bugreport (${prefix}reportbug, ${prefix}bug) - Report a bug to the developers of Ally.\n**+1 more**`
    }]);
    return embed;
}

export function helpModeration(): MessageEmbed {
    var embed = new MessageEmbed();
    embed.setTitle(`Moderation Commands | Help - ${name}`);
    embed.setDescription(`Commands to help you moderate your server with ${name}`);
    embed.setURL("https://allydiscord.github.io/docs/commands/moderation/");
    embed.addFields([{
        name: `${prefix}warn (${prefix}!)`,
        value: "Warn a user for something, such as breaking a rule."
    }, {
        name: `${prefix}permissions (${prefix}permission, ${prefix}perms, ${prefix}perm)`,
        value: "Change permissions for the current guild."
    }]);
    return embed;
}

export function helpUtility(): MessageEmbed {
    var embed = new MessageEmbed();
    embed.setTitle(`Utility Commands | Help - ${name}`);
    embed.setDescription(`Commands to setup ${name} to your server's needs.`);
    embed.setURL("https://allydiscord.github.io/docs/commands/utility");
    embed.addFields([{
        name: "filler",
        value: "filler"
    }])
    return embed;
}