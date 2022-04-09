import { ChatInputApplicationCommandData, CommandInteraction, MessageEmbed } from "discord.js";
import { timeout } from "../main";
import { color } from "../meta/config";
import { Action, Colors, getCase, getCases, renderCase } from "../utils/caseManager";
import { hasPermission } from "../utils/checkPerms";

export const data: ChatInputApplicationCommandData = {
    name: "case",
    description: "Get or update case information",
    options: [
        {
            name: "get",
            description: "Get information on a case[s]",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "one",
                    description: "Get information on a specific case",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "case",
                            description: "ID of the case to get info for",
                            type: "INTEGER",
                            required: true
                        }, {
                            name: "hidden",
                            description: "Only send this info to you (default: false)",
                            type: "BOOLEAN",
                        }
                    ]
                }, {
                    name: "user",
                    description: "Get information on a user's cases",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "user",
                            description: "User to get cases for",
                            type: "USER",
                            required: true
                        }, {
                            name: "page",
                            description: "Page of cases to get",
                            type: "INTEGER",
                        }, {
                            name: "hidden",
                            description: "Only send this info to you (default: false)",
                            type: "BOOLEAN",
                        }
                    ]
                }
            ]
        }, {
            name: "list",
            description: "List cases in guild",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "page",
                    description: "Page of cases to get",
                    type: "INTEGER"
                }, {
                    name: "hidden",
                    description: "Only send this info to you (default: false)",
                    type: "BOOLEAN",
                }
            ]
        }, {
            name: "update",
            description: "Update the reason for a specific case",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "case",
                    description: "Case to update information for",
                    type: "INTEGER",
                    required: true
                }, {
                    name: "reason",
                    description: "New reason for the case",
                    type: "STRING",
                    required: true,
                }, {
                    name: "hidden",
                    description: "Only send this info to you (default: false)",
                    type: "BOOLEAN",
                }
            ]
        }, {
            name: "expunge",
            description: "Expunge a case from the record (Note: This expunges all data, but not the ID)",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "case",
                    description: "Case to expunge from the record",
                    type: "INTEGER",
                    required: true,
                }
            ]
        }
    ]
};

export async function handler(interaction: CommandInteraction) {
    const hidden = interaction.options.getBoolean("hidden") ?? false;
    await interaction.deferReply( { ephemeral: hidden });
    switch (await interaction.options.getSubcommand()) {
        case "list": {
            if (!await hasPermission(interaction.guild,interaction.user.id,Action.ViewCases)) {
                await interaction.editReply({ content: ":no_entry_sign: You cannot use this command." });
                await timeout(3000);
                interaction.deleteReply();
                return;
            }
            const page = await interaction.options.getInteger("page") ?? 1;
            const allCases = (await getCases(interaction.guildId)).reverse();
            const start = (page -1) *5, end = page*5 >= allCases.length ? allCases.length : page*5;
            if (start >= allCases.length) {
                await interaction.editReply({ content: ":x: That page does not exist." });
                await timeout(3000);
                interaction.deleteReply();
                return;
            }
            const embed = new MessageEmbed()
                .setTitle(`Cases ${start +1} - ${end} out of ${allCases.length}`)
                .setDescription("To see more info about a specific case, use `/case get one [id]` with the ID of the case you want.")
                .setColor(color);
            const cases = allCases.slice((page -1)*5, page*5);
            cases.forEach( ({ data, index }) => {
                embed.addField(`Case ${index +1}`,renderCase(data));
            });
            interaction.editReply({ embeds: [embed] });
            break;
        }

        case "one": {
            if (!await hasPermission(interaction.guild,interaction.user.id,Action.ViewCases)) {
                await interaction.editReply({ content: ":no_entry_sign: You cannot use this command." });
                await timeout(3000);
                interaction.deleteReply();
                return;
            }
            const caseId = await interaction.options.getInteger("case");
            const caseData = await getCase(interaction.guildId,caseId);
            if (!caseData) {
                await interaction.editReply({ content: ":x: No case with that ID exists." });
                return;
            }
            const embed = new MessageEmbed()
                .setTitle(`Case ${caseId}`)
                .setDescription(renderCase(caseData))
                .setColor(Colors[caseData.type]);
            interaction.editReply({ embeds: [embed] });
            break;
        }

}
