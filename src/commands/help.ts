import { Message, MessageEmbed } from "discord.js";
import { name, prefix, version } from "../meta/about";
import * as embeds from "../meta/embeds";
import * as pingCmd from "./ping";
// import * as settingsCmd from "./settings";
// import * as warnCmd from "./warn";
// import * as aboutCmd from "./about";

export function handle ( msg: Message, args: string[] ) {
    var embed: MessageEmbed;
    switch (args[0]) {
        /* //#region Categories
        case "utility":
            embed = embeds.helpUtility();
            break;
        
        case "moderation":
            embed = embeds.helpModeration();
            break;
        //#endregion Categories */
        
        //#region Commands
        case "ping":
            embed = pingCmd.helpEmbed();
            break;
        case "help":
        case "?":
            embed = helpEmbed();
            break;
        //#endregion Commands

        default:
            embed = embeds.helpDefault();
            break;
    }
    embed.setColor(0x0099FF);
    embed.setTimestamp(new Date());
    embed.setFooter(`Requested by ${msg.author.username} | ${name} v${version}`, msg.author.avatarURL());
    msg.channel.send({ embed: embed });
}

export function helpEmbed (): MessageEmbed {
    var embed = new MessageEmbed();
    embed.setTitle(`${prefix}help [category|command]`)
    embed.setDescription("Get help without even leaving Discord.")
    embed.setURL("https://allydiscord.github.io/docs/commands/utility/help/");
    embed.addFields([{
        name: "[category|command]",
        value: "**Optional.**  Category or command to pull documentation for."
    }, {
        name: "Command Aliases",
        value: `${prefix}?`
    }]);
    return embed;
}