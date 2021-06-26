import { Message, MessageEmbed } from "discord.js";
import { getLocalGuild, updateLocalGuild } from "../databases/manager";
import { name } from "../meta/config";
import { HelpEmbeds } from "../meta/embeds";
import { hasPermission, Actions } from "../utils/checkPerms";

export enum SettingValues {
    TextChannelorSame = "Text Channel, `same`",
    TextChannel = "Text Channel",
    Boolean = "`yes`, `no`",
    Role = "Role"
}

export interface Setting {
    description: string,
    allowedValues: SettingValues,
    value: any
}

export function handle (msg: Message, args: string[]) {
    if (!hasPermission(msg.guild, msg.member, Actions.Settings)) {
        msg.reply("you do not have permission to use that command.");
        return;
    }

    let lGuild = getLocalGuild(msg.guild.id);
    var guildSettings = lGuild.settings;
    if (!guildSettings) {
        msg.reply("an error occoured internally, please try again later.");
    }

    if (!args[0]) { // no setting given
        msg.reply("please give a setting to change.  For a full list, see https://allydiscord.github.io/docs/settings/");
        return;
    } else if (guildSettings[args[0]]) { // setting given, valid
        var setting: Setting = guildSettings[args[0]];

        if (!args[1]) { // no value given
            var embed: MessageEmbed = new MessageEmbed();
            embed.setTitle(args[0] +` | Settings - ${name}`);
            embed.setDescription(setting.description);
            embed.setURL("https://allydiscord.github.io/docs/settings/#"+ args[0]);
            embed.addFields([
                {
                    name: "Current Value",
                    value: renderValue(setting),
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
                var oldValue = renderValue(setting);

                if (args[1] == "none") setting.value = null;
                if (setting.allowedValues == SettingValues.TextChannelorSame) {
                    if (args[1].toLowerCase() == "same") setting.value = "same";
                    if (msg.guild.channels.resolve(args[1].slice(2, -1))) setting.value = args[1].slice(2, -1);
                }
                if (setting.allowedValues == SettingValues.TextChannel) {
                    if (msg.guild.channels.resolve(args[1].slice(2, -1))) setting.value = args[1].slice(2, -1);
                }
                if (setting.allowedValues == SettingValues.Boolean) {
                    if (args[1].toLowerCase() == "yes") setting.value = true;
                    if (args[1].toLowerCase() == "no") setting.value = false;
                }

                guildSettings[args[0]] = setting;
                lGuild.settings = guildSettings;
                updateLocalGuild(msg.guild.id, lGuild);

                var embed = new MessageEmbed();
                embed.setTitle(`${args[0]} | Settings - ${name}`);
                embed.setDescription("Value successfully changed!");
                embed.addFields([
                    {
                        name: "Old Value",
                        value: oldValue,
                        inline: true
                    },
                    {
                        name: "Current Value",
                        value: renderValue(setting),
                        inline: true
                    }
                ]);
                embed.setTimestamp(new Date());
                embed.setThumbnail("https://i.imgur.com/YVRMcUD.png");
                embed.setColor(0x00FF00);
                msg.channel.send({embed: embed});
                return;
            } else { // value given, invalid
                msg.reply("that setting cannot accept that value.  Accepted types are: "+ guildSettings[args[0]].allowedValues +".");
                return;
            }
        }
    } else { // setting given, invalid
        msg.reply("that setting does not exist.");
        return;
    }
}

function confirmValue (setting: Setting, value: string, message: Message): boolean {
    if (value.toLowerCase() == "none") return true;

    if (setting.allowedValues == SettingValues.TextChannelorSame) {
        if (value.toLowerCase() == "same") return true;
        if (message.guild.channels.resolve(value.slice(2, -1)))
        if (message.guild.channels.resolve(value.slice(2, -1)).isText()) return true;
        return false;
    } if (setting.allowedValues == SettingValues.TextChannel) {
        if (message.guild.channels.resolve(value.slice(2, -1)))
        if (message.guild.channels.resolve(value.slice(2, -1)).isText()) return true;
        return false;
    } if (setting.allowedValues == SettingValues.Boolean) {
        if (value.toLowerCase() == 'yes') return true;
        if (value.toLowerCase() == "no") return true;
        return false;
    }

    return false;
}

function renderValue (setting: Setting): String {
    if (setting.value === null) return "none";

    if (setting.allowedValues == SettingValues.TextChannelorSame) {
        if (setting.value == "same") return "same";
        return `<#${setting.value}>`;
    }
    if (setting.allowedValues == SettingValues.TextChannel) {
        return `<#${setting.value}>`;
    }
    if (setting.allowedValues == SettingValues.Boolean) {
        return setting.value ? "yes" : "no";
    }
}

export const helpEmbed: HelpEmbeds = [{
    title: `settings (setting) [value]`,
    description: "Change and view settings for the current server.",
    url: "/docs/commands/utility/settings/",
    fields: [
        {
            name: "(setting)",
            value: "**Required.**  Setting to change or view."
        },
        {
            name: "[value]",
            value: "**Optional.**  Value to set the setting to.  Omit to see the current value."
        },
        {
            name: "Aliases",
            value: "@psetting, @psets, @pset"
        }
    ]
}]
