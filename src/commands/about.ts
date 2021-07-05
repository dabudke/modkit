import { Message, MessageEmbed } from "discord.js";
import { name, prefix, url, team, color, version } from "../meta/config";
import { HelpEmbeds } from "../meta/embeds";

export function handle ( message: Message ): void {
    const embed: MessageEmbed = new MessageEmbed();
    embed.setTitle(`Hi, I'm ${name}`);
    embed.setDescription(`I am a Discord bot developed by LittleKitacho, and ran by the people below.\nMy global prefix is ${prefix} and my website is at ${url}/.`);
    embed.setURL(url);
    embed.setColor(color);
    team.forEach( ( iteam ) => {
        embed.addField(iteam.name, iteam.members.join(", "));
    });
    embed.setFooter(`${name} v${version}`);
    embed.setTimestamp(new Date());
    message.channel.send(embed);
}

export const helpEmbed: HelpEmbeds = [{
    title: "about",
    description: "Get information about @n.",
    url: "/docs/commands/other/about/"
}];
