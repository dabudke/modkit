import { ChatInputApplicationCommandData, CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { timeout } from "../main";
import { color } from "../meta/config";
import { Action, CaseId, CaseInfo, Colors, expungeCase, getCase, getCases, getModCases, getTargetCases, renderCase, updateCase } from "../dataManagers/caseManager";
import { hasPermission } from "../utils/checkPerms";

export const data: ChatInputApplicationCommandData = {
    name: "case",
    description: "Get or update case information",
    options: [
        {
            name: "get",
            description: "Get information on a case[s]",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "id",
                    type: "INTEGER",
                    description: "Case ID to get information for"
                }
            ]
        }, {
            name: "list",
            description: "List cases in guild",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "all",
                    description: "Get all cases for this server",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "page",
                            description: "Page of cases to get",
                            type: "INTEGER"
                        }
                    ]
                }, {
                    name: "user",
                    description: "Get all cases for a user",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "user",
                            description: "User to get cases for",
                            type: "USER"
                        }, {
                            name: "page",
                            description: "Page of cases to get",
                            type: "INTEGER"
                        }
                    ]
                }, {
                    name: "mod",
                    description: "Get all cases of which a user was the moderator",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "user",
                            description: "Moderator to get cases for",
                            type: "USER"
                        }, {
                            name: "page",
                            description: "Page of cases to get",
                            type: "INTEGER"
                        }
                    ]
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

function buttonAction( page: number, cases: CaseInfoObj[] ) {
    return async (interaction: MessageComponentInteraction) => {
        await interaction.deferUpdate();
        switch (interaction.customId) {
            case "back":
                paginate(interaction, cases, page -1);
                break;
            case "forward": {
                paginate(interaction,cases,page +1);
                break;
            }
        }
    };
}

type CaseInfoObj = { data: CaseInfo, index: CaseId };

async function paginate(interaction: MessageComponentInteraction | CommandInteraction, cases: CaseInfoObj[], page: number) {
    const start = (page-1)*5, end = page*5 >= cases.length ? cases.length -1 : page*5;
    if (cases.length === 0) {
        await interaction.editReply({ content: ":x: No cases were found."});
        await timeout(3000);
        return interaction.deleteReply();
    }
    if (start >= cases.length) {
        await interaction.editReply({ content: ":x: That page does not exist." });
        await timeout(3000);
        return interaction.deleteReply();
    }
    if (start > end) {
        await interaction.editReply({ content: ":x: That page does not exist." });
        await timeout(3000);
        return interaction.deleteReply();
    }
    const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton({ emoji: "◀️", style: "SECONDARY", customId: "back", disabled: page <= 1 }),
            new MessageButton({ emoji: "▶️", style: "SECONDARY", customId: "forward", disabled: end === cases.length -1 })
        );
    const embed = new MessageEmbed()
        .setTitle(`Cases ${start+1} - ${end+1} out of ${cases.length}`)
        .setDescription("Use the `page` option to select different pages")
        .setColor(color);
    cases.slice(start,end+1).forEach( ({data,index}) => {
        embed.addField(`Case ${index+1}`,renderCase(data));
    });
    const reply = await interaction.editReply({ embeds: [embed], components: [buttons] });
    interaction.channel.createMessageComponentCollector({ max: 1, message: reply }).on("collect",buttonAction(page,cases));
}

export async function handler(interaction: CommandInteraction) {
    await interaction.deferReply();
    switch (await interaction.options.getSubcommand()) {
        case "get": {
            if (!await hasPermission(interaction.guild,interaction.user.id,Action.ViewCases)) {
                await interaction.editReply({ content: ":no_entry_sign: You cannot use this command." });
                await timeout(3000);
                return interaction.deleteReply();
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

        case "all": {
            if (!await hasPermission(interaction.guild,interaction.user.id,Action.ViewCases)) {
                await interaction.editReply({ content: ":no_entry_sign: You cannot use this command." });
                await timeout(3000);
                return interaction.deleteReply();
            }
            const page = await interaction.options.getInteger("page") ?? 1;
            const allCases = (await getCases(interaction.guildId)).reverse();
            paginate(interaction,allCases,page);
            break;
        }

        case "user": {
            if (!await hasPermission(interaction.guild,interaction.user.id,Action.ViewCases)) {
                await interaction.editReply({ content: ":no_entry_sign: You cannot use this command." });
                await timeout(3000);
                return interaction.deleteReply();
            }
            const user = (await interaction.options.getUser("user")).id, page = await interaction.options.getInteger("page") ?? 1, allCases = (await getTargetCases(interaction.guildId,user));
            paginate(interaction,allCases,page);
            break;
        }

        case "mod": {
            if (!await hasPermission(interaction.guild,interaction.user.id,Action.ViewCases)) {
                await interaction.editReply({ content: ":no_entry_sign: You cannot use this command." });
                await timeout(3000);
                return interaction.deleteReply();
            }
            const user = (await interaction.options.getUser("user")).id, page = await interaction.options.getInteger("page") ?? 1, allCases = (await getModCases(interaction.guildId,user));
            paginate(interaction,allCases,page);
            break;
        }

        case "update": {
            const caseId = await interaction.options.getInteger("case"), caseData = await getCase(interaction.guildId, caseId), reason = await interaction.options.getString("reason");
            if (caseData.user.id !== interaction.user.id && !await hasPermission(interaction.guild,interaction.user.id,Action.UpdateCase)) {
                await interaction.editReply({ content: ":no_entry_sign: You cannot use this command." });
                await timeout(2000);
                return interaction.deleteReply();
            }
            const success = await updateCase(interaction.guildId,caseId,reason);
            if (!success) {
                await interaction.editReply({ content: `:x: That case does not exist.` });
                await timeout(2000);
                return interaction.deleteReply();
            }
            await interaction.editReply({ content: `:white_check_mark: Reason updated to '${reason}'`});
            await timeout(2000);
            return interaction.deleteReply();
        }

        case "expunge": {
            if (!await hasPermission(interaction.guild,interaction.user.id,Action.ExpungeCase)) {
                await interaction.editReply({ content: ":no_entry_sign: You cannot use this command." });
                await timeout(2000);
                return interaction.deleteReply();
            }
            const success = await expungeCase(interaction.guildId,interaction.options.getInteger("case"));
            if (!success) {
                await interaction.editReply({ content: `:x: That case does not exist.` });
                await timeout(2000);
                return interaction.deleteReply();
            }
            await interaction.editReply({ content: ":white_check_mark: Case expunged." });
            await timeout(2000);
            return interaction.deleteReply();
        }
    }
}
