import { Message, MessageEmbed } from "discord.js";
import { name, prefix, version } from "../meta/about";
import * as embeds from "../meta/embeds";
import * as pingCmd from "./ping";
// import * as settingsCmd from "./settings";
// import * as warnCmd from "./warn";
// import * as aboutCmd from "./about";

export function handle ( msg: Message, args: string[] ) {
    switch (args[0]) {
        //#region Categories
        case "moderation":
            msg.channel.send({embed: decompEmbed(embeds.helpModeration, Number(args[1]), true)});
            break;
        case "utility":
            msg.channel.send({embed: decompEmbed(embeds.helpUtility, Number(args[1]), true)});
            break;
        case "leveling":
            msg.channel.send({embed: decompEmbed(embeds.helpLeveling, Number(args[1]), true)});
            break;
        case "other":
            msg.channel.send({embed: decompEmbed(embeds.helpOther, Number(args[1]), true)});
            break;
        //#endregion Categories
        
        //#region Commands
        /*case "ping":
            msg.channel.send({embed: decompEmbed(pingCmd.helpEmbed)});
            break;*/
        case "help":
        case "?":
            msg.channel.send({embed: decompEmbed(helpEmbed)});
            break;
        //#endregion Commands

        case undefined:
            msg.channel.send({embed: decompEmbed(embeds.helpDefault)});
            break;

        default:
            msg.reply("that command/category does not exist.");
            break;
    }
}

function decompEmbed (embeds: embeds.HelpEmbeds, page?: number, paged?: boolean): MessageEmbed {
    var decompEmbed: MessageEmbed = new MessageEmbed();
    if (!page || page > embeds.length) {
        page = 1;
    }
    var compEmbed = embeds[page -1];
    decompEmbed.setTitle(compEmbed.title.concat(" - Ally"));
    decompEmbed.setDescription(compEmbed.description);
    decompEmbed.setURL(compEmbed.url);
    decompEmbed.addFields(compEmbed.fields);
    decompEmbed.setTimestamp(new Date());
    decompEmbed.setThumbnail("https://i.imgur.com/YVRMcUD.png");
    if (paged) decompEmbed.setFooter(`Page ${page}/${embeds.length}`);
    decompEmbed.setColor(0x0099FF);
    return decompEmbed;
}

export const helpEmbed: embeds.HelpEmbeds = [
    {
        title: `${prefix}help [command/category] | Help`,
        description: "Show an index of commands, and how to use them.",
        url: "https://allydiscord.github.io/docs/commands/utility/help/",
        fields: [
            {
                name: "[command/category]",
                value: "Optional.  Command or category to recieve documentation for."
            },
            {
                name: "Aliases",
                value: `${prefix}?`
            }
        ]
    }
]
