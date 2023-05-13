import { ChatInputApplicationCommandData, CommandInteraction, Guild, MessageEmbed, Snowflake } from "discord.js";
import { handle } from "../dataManagers/errorManager";
import { getSettingType, getSettingValue, setSetting, settings, SettingType, typeText } from "../dataManagers/settingManager";
import { timeout } from "../main";
import { hasPermission, PermAction } from "../utils/checkPerms";
import { permissionError, waitToDeleteInteraction } from "../utils/messageUtils";

export const data: ChatInputApplicationCommandData = {
    name: "setting",
    description: "See or change settings for this server",
    type: "CHAT_INPUT",
    options: [
        {
            name: "get",
            description: "Get setting value for this server",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "setting",
                    description: "Setting to get the value of",
                    type: "STRING",
                    choices: settings.map(v=>({name:v,value:v})),
                    required: true
                }
            ]
        }, {
            name: "set",
            description: "Set setting value for this server",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "setting",
                    description: "Setting to set the value of",
                    type: "STRING",
                    choices: settings.map(v=>({name:v,value:v})),
                    required: true
                }, {
                    name: "value",
                    description: "New value of the setting",
                    type: "STRING",
                    required: true,
                    autocomplete: true
                }
            ]
        }
    ]
};

export async function handler(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    if (!await hasPermission(interaction.guild,interaction.user.id,PermAction.ManageSettings)) {
        await interaction.editReply({ content: permissionError });
        return waitToDeleteInteraction(interaction);
    }
    const setting = interaction.options.getString("setting");
    switch(interaction.options.getSubcommand()) {
        case "get": {
            const value = await getSettingValue(interaction.guildId,setting), type = await getSettingType(setting), embed = new MessageEmbed();
            embed.setTitle("Setting " + setting)
                .setDescription("**Value:** " + await renderValue(interaction.guild,value,type))
                .addField("Acceptable Values", typeText[type])
                .setColor(getColor(value,type));
            await interaction.editReply({ embeds: [embed] });
            break;
        }
        case "set": {
            const type = await getSettingType(setting), value = interaction.options.getString("value");
            switch (type) {
                case SettingType.Boolean:
                    if (value.toLowerCase() === "true") {
                        await setSetting(interaction.guildId,setting,true);
                        await interaction.editReply({ content: ":white_check_mark: Value updated to **true**" });
                    } else if (value.toLowerCase() === "false") {
                        await setSetting(interaction.guildId,setting,false);
                        await interaction.editReply({ content: ":white_check_mark: Value updated to **false**" });
                    }
                    else await interaction.editReply({ content: ":x: Value not recognized." });
                    break;
                case SettingType.Channel: {
                    const channel = interaction.guild.channels.resolve(value);
                    if (!channel) await interaction.editReply({ content: ":x: Value not recognized." });
                    else {
                        await setSetting(interaction.guildId,setting,channel.id);
                        await interaction.editReply({ content: `:white_check_mark: Value updated to channel <#${channel.id}>`});
                    }
                }
            }
            await timeout(3000);
            return interaction.deleteReply().catch(handle("settings_replyDeleted"));
        }
    }
}

function getColor(value:unknown,type:SettingType): number {
    switch(type) {
        case SettingType.Boolean:
            if (value as boolean) return 0x3dff71;
            else return 0xff5b4f;
        case SettingType.Channel:
            if (value === null) return 0xababab;
            else return 0x4d91ff;
    }
}

function renderValue(guild: Guild,value:unknown,type:SettingType): string {
    switch (type) {
        case SettingType.Boolean:
            if (value as boolean) return "true";
            else return "false";
        case SettingType.Channel: {
            const channel = guild.channels.resolve(value as Snowflake);
            return channel ? `<#${channel.id}>` : "*none set*";
        }
    }
}
