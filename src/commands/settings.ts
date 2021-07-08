import { Message, MessageEmbed } from "discord.js";
import { name } from "../meta/config";
import { HelpEmbeds } from "../meta/embeds";
import { hasPermission, Actions } from "../utils/checkPerms";
import { setSetting, getSetting, SettingValues, Setting } from "../utils/settingManager";

export function handle (msg: Message, args: string[]): void {
    // filter: permission check
    if (!hasPermission(msg.guild, msg.member, Actions.Settings)) {
        msg.reply("you do not have permission to use that command.");
        return;
    }

    // filter: no setting given
    if (!args[0]) {
        msg.reply("please give a setting to change.  For a full list, see https://allydiscord.github.io/docs/settings/");
        return;
    }

    // filter: invalid setting
    const setting = getSetting(msg.guild.id, args[0]);
    if (!setting) {
        msg.reply("that setting does not exist.");
        return;
    }

    // filter: no value given
    if (!args[1]) {
        const embed: MessageEmbed = new MessageEmbed();
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
    }

    // filter: value validity (try typing that 5 times fast)
    const valueValid = confirmValue(setting, args[1], msg);
    if ( !valueValid ) { // value invalid
        msg.reply("that setting cannot accept that value.  Acceptable values are ".concat(setting.allowedValues));
        return;
    }

    // parse and set new value
    let newValue: unknown;
    if (args[1] == "none") setting.value = null;
    switch ( setting.allowedValues ) {
        case SettingValues.TextChannelorSame:
            if (args[1].toLowerCase() == "same") newValue = "same";
            if (msg.guild.channels.resolve(args[1].slice(2,-1))) newValue = args[1].slice(2, -1);
            break;

        case SettingValues.TextChannel:
            if (msg.guild.channels.resolve(args[1].slice(2, -1))) newValue = args[1].slice(2, -1);
            break;

        case SettingValues.Boolean:
            if (args[1].toLowerCase() == "yes") newValue = true;
            if (args[1].toLowerCase() == "no") newValue = false;
            break;
    }
    setSetting(msg.guild.id, args[0], newValue);

    // construct embed
    const embed = new MessageEmbed();
    embed.setTitle(`${args[0]} | Settings - ${name}`);
    embed.setDescription("Value successfully changed!");
    embed.addFields([
        {
            name: "Old Value",
            value: renderValue(setting),
            inline: true
        },
        {
            name: "Current Value",
            value: renderValue(getSetting(msg.guild.id, args[0]) as Setting),
            inline: true
        }
    ]);
    embed.setTimestamp(new Date());
    embed.setThumbnail("https://i.imgur.com/YVRMcUD.png");
    embed.setColor(0x00FF00);
    msg.channel.send({embed: embed});
    return;
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

function renderValue (setting: Setting): string {
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
