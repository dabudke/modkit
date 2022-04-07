import { ChatInputApplicationCommandData, CommandInteraction, MessageEmbed } from "discord.js";
import { isDevelopment } from "../main";
import { name, url, team, color, version } from "../meta/config";

export const data: ChatInputApplicationCommandData = {
    name: "about",
    description: `Get info about ${name} and it's developers`,
    type: "CHAT_INPUT"
};

export function handler ( interaction: CommandInteraction ): void {
    const embed: MessageEmbed = new MessageEmbed();
    embed.setTitle(`${name} - v${version}`);
    embed.setDescription(`The only Discord bot you'll need.\nDiscord has a lot of features, Discord bots create bloat.  ${name} is the perfect moderator's toolkit, extending Discord's features without covering them.\nOwned/Operated by LittleKitacho`);
    embed.setURL(url);
    embed.setColor(color);
    team.forEach( ( iteam ) => {
        embed.addField(iteam.name, iteam.members.join(", "));
    });
    if (isDevelopment) embed.setFooter({ text: "DEVELOPMENT" });
    embed.setTimestamp(new Date());
    interaction.reply({ embeds: [embed] });
}
