import { Message, MessageEmbed } from "discord.js";
import { truncate } from "node:fs";
import { getLocalGuild } from "../databases/manager";
import { name, prefix } from "../meta/about";
import { HelpEmbeds } from "../meta/embeds";
import { hasPermission, Actions } from "../utils/checkPerms";

export enum SettingValues {
    ChannelOrSame = "Channel, `same`",
    Channel = "Channel",
    Boolean = "`yes`, `no`"
}

export interface Setting {
    description: string,
    allowedValues: SettingValues,
    value: any
}

export function handle (msg: Message, args: string[]) {
    if (!hasPermission(msg.guild, msg.member, Actions.Settings)) {
        msg.reply("you do not have permission to use that command!");
        return;
    }

    const GuildSettings = getLocalGuild(msg.guild.id).settings;
    if (!GuildSettings) {
        msg.reply("an error occoured internally, please try again later.");
    }

    if (!args[0]) { // no setting given
        msg.reply("please give a setting to change.  For a full list, see https://allydiscord.github.io/docs/settings/");
        return;
    } else if (GuildSettings[args[0]]) { // setting given, valid
        var setting: Setting = GuildSettings[args[0]];

        if (!args[1]) { // no value given
            var embed: MessageEmbed = new MessageEmbed();
            embed.setTitle(args[0] +` | Settings - ${name}`);
            embed.setDescription(setting.description);
            embed.setURL("https://allydiscord.github.io/docs/settings/#"+ args[0]);
            embed.addFields([
                {
                    name: "Current Value",
                    value: setting.value,
                    inline: true
                },
                {
                    name: "Allowed Values",
                    value: setting.allowedValues,
                    inline: true
                }
            ]);
            embed.setTimestamp(new Date());
            embed.setThumbnail("https://i.imgur.com/YVRMcUD.png");
            embed.setColor(0x0099FF);
            msg.channel.send({embed: embed});
            return;
        } else {
            var valueValid = confirmValue(setting, args[1], msg);
            if ( valueValid ) { // value given, valid
                var oldValue = setting.value;

                if (setting.allowedValues == SettingValues.ChannelOrSame) {
                    if (args[1].toLowerCase() == "same") setting.value == "same";
                    if (msg.guild.channels.resolve(args[1].slice(2, -1))) setting.value = args[1].slice(2, -1);
                }
                if (setting.allowedValues == SettingValues.Channel) {
                    if (msg.guild.channels.resolve(args[1].slice(2, -1))) setting.value = args[1].slice(2, -1);
                }
                if (setting.allowedValues == SettingValues.Boolean) {
                    if (args[1].toLowerCase() == "yes") setting.value = true;
                    if (args[1].toLowerCase() == "no") setting.value = false;
                }

                var embed = new MessageEmbed();
                embed.setTitle(`${args[0]} | Settings - ${name}`);
                embed.setDescription("Value successfully changed!");
                embed.addFields([
                    {
                        name: "Old Value",
                        value: oldValue
                    },
                    {
                        name: "Current Value",
                        value: setting.value
                    }
                ]);
                embed.setTimestamp(new Date());
                embed.setThumbnail("https://i.imgur.com/YVRMcUD.png");
                embed.setColor(0x00FF00);
                msg.channel.send({embed: embed});
                return;
            } else { // value given, invalid
                msg.reply("that setting cannot accept that value.  Accepted types are: "+ GuildSettings[args[0]].allowedValues +".");
                return;
            }
        }
    } else { // setting given, invalid
        msg.reply("that setting does not exist.");
        return;
    }
}

function confirmValue (setting: Setting, value: string, message: Message): boolean {

    if (setting.allowedValues == SettingValues.ChannelOrSame) {
        if (value.toLowerCase() == "same") return true;
        if (message.guild.channels.resolve(value.slice(2, -1))) return true;
        return false;
    } if (setting.allowedValues == SettingValues.Channel) {
        if (message.guild.channels.resolve(value.slice(2, -1))) return true;
        return false;
    } if (setting.allowedValues == SettingValues.Boolean) {
        if (value.toLowerCase() == ('yes' || 'no')) return true;
        return false;
    }

    return false;
}

export const helpEmbed: HelpEmbeds = [{
    title: `${prefix}settings (setting) [value]`,
    description: "Change and view settings for the current server.",
    url: "https://allydiscord.github.io/docs/commands/utility/settings/",
    fields: [
        {
            name: "(setting)",
            value: "**Required.**  Setting to change or view."
        },
        {
            name: "[value]",
            value: "**Optional.**  Value to set the setting to.  Omit to see the current value."
        }
    ]
}]
