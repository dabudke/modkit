import { Message, MessageEmbed } from "discord.js";
import { name, prefix, url } from "../meta/config";
import { HelpEmbeds, helpModeration, helpUtility, helpLeveling, helpOther, helpDefault } from "../meta/embeds";
import { helpEmbed as ping } from "./ping";
import { helpEmbed as settings } from "./settings";
import { helpEmbed as warn } from "./warn";
import { helpEmbed as about } from "./about";

export function handle ( msg: Message, args: string[] ): void {
    switch (args[0]) {
        //#region Categories
        case "moderation":
            msg.channel.send({embed: decompEmbed(helpModeration, Number(args[1]), true, true)});
            break;
        case "utility":
            msg.channel.send({embed: decompEmbed(helpUtility, Number(args[1]), true, true)});
            break;
        case "leveling":
            msg.channel.send({embed: decompEmbed(helpLeveling, Number(args[1]), true, true)});
            break;
        case "other":
            msg.channel.send({embed: decompEmbed(helpOther, Number(args[1]), true, true)});
            break;
        //#endregion Categories
        
        //#region Commands
        case "ping":
            msg.channel.send({embed: decompEmbed(ping)});
            break;
        case "help":
        case "?":
            msg.channel.send({embed: decompEmbed(helpEmbed)});
            break;
        case "settings":
        case "setting":
        case "sets":
        case "set":
            msg.channel.send({embed: decompEmbed(settings)});
            break;
        case "warn":
        case "!":
            msg.channel.send({embed: decompEmbed(warn)});
            break;
        case "about":
            msg.channel.send({embed: decompEmbed(about)});
            break;
        //#endregion Commands

        case undefined:
            msg.channel.send({embed: decompEmbed(helpDefault)});
            break;

        default:
            msg.reply("that command/category does not exist.");
            break;
    }
}

function decompEmbed (embeds: HelpEmbeds, page?: number, paged?: boolean, nonCommand?: boolean): MessageEmbed {
    const decompEmbed: MessageEmbed = new MessageEmbed();
    if (!page || page > embeds.length) {
        page = 1;
    }
    const compEmbed = embeds[page -1];
    decompEmbed.setTitle(`${nonCommand ? "" : prefix}${compEmbed.title} - ${name} Help`);
    decompEmbed.setDescription(compEmbed.description.replace(/@p/g, prefix).replace(/@n/g, name));
    decompEmbed.setURL(url + compEmbed.url);
    if (compEmbed.fields) compEmbed.fields.forEach( field => decompEmbed.addField(field.name.replace(/@p/g, prefix).replace(/@n/g, name), field.value.replace(/@p/g, prefix).replace(/@n/g, name), field.inline));
    decompEmbed.setTimestamp(new Date());
    decompEmbed.setThumbnail("https://i.imgur.com/YVRMcUD.png");
    if (paged) decompEmbed.setFooter(`Page ${page}/${embeds.length}`);
    decompEmbed.setColor("#0099FF");
    return decompEmbed;
}

export const helpEmbed: HelpEmbeds = [
    {
        title: `help [command/category] | Help`,
        description: "Show an index of commands, and how to use them.",
        url: "/docs/commands/utility/help/",
        fields: [
            {
                name: "[command/category]",
                value: "Optional.  Command or category to recieve documentation for."
            },
            {
                name: "Aliases",
                value: `@p?`
            }
        ]
    }
]
