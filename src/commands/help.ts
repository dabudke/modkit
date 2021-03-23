import { Message, MessageEmbed } from "discord.js";
import { name, prefix, version } from "../meta/about";
// import * as embeds from "../meta/embeds";
import * as pingCmd from "./ping";
import * as settingsCmd from "./settings";
// import * as warnCmd from "./warn";
// import * as aboutCmd from "./about";

export function handle ( msg: Message, args: string[] ) {
    var embed: MessageEmbed;
    switch (args[0]) {
        //#region Categories
/*         case "utility":
            msg.channel.send({ embed: embeds.utility(msg) });
            break;
        
        case "moderation":
            msg.channel.send({ embed: embeds.moderation(msg) });
            break; */
        //#endregion Categories
        
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
            embed = new MessageEmbed();
            break;
    }
    embed.setColor(0x0099FF);
    embed.setTimestamp(new Date());
    embed.setFooter(`Requested by ${msg.author.username} | ${name} v${version}`);
    msg.channel.send({ embed: embed });
}

export function helpEmbed (): MessageEmbed {
    var embed = new MessageEmbed();
    embed.setTitle(`${prefix}help [category|command]`)
    embed.setDescription("Get help without even leaving Discord.")
    embed.setURL("https://allydiscord.github.io/docs/commands/utility/help/");
    embed.addFields({
        name: "[category|command]",
        value: "**Optional.**  Category or command to pull documentation for."
    });
    return embed;
}