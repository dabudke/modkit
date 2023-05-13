import { ChatInputApplicationCommandData, CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { color } from "../meta/config";
import { expungeCase, getCase, renderCase, renderCaseEmbed, updateCase, InPlaceAction, getAllCases, getAllUserCases, getAllModCases } from "../dataManagers/caseManager";
import { hasPermission, PermAction } from "../utils/checkPerms";
import { errorMessage, permissionError, successMessage, waitToDeleteInteraction } from "../utils/messageUtils";

export const data: ChatInputApplicationCommandData = {
    name: "case",
    description: "Get or update case information",
    options: [
        {
            name: "get",
            description: "Get information on a single case",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "id",
                    type: "INTEGER",
                    description: "Case ID to get information for",
                    required: true
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

function buttonAction( page: number, cases: InPlaceAction[] ) {
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

async function paginate(interaction: MessageComponentInteraction | CommandInteraction, cases: InPlaceAction[], page: number) {
    const start = (page-1)*5, end = page*5 >= cases.length ? cases.length : page*5;
    if (cases.length === 0) {
        await interaction.editReply({ content: errorMessage("No cases were found.") });
        return waitToDeleteInteraction(interaction);
    }
    if (start >= cases.length) {
        await interaction.editReply({ content: errorMessage("No page was found.") });
        return waitToDeleteInteraction(interaction);
    }
    if (start > end) {
        await interaction.editReply({ content: errorMessage("No page was found.") });
        return waitToDeleteInteraction(interaction);
    }
    const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton({ emoji: "◀️", style: "SECONDARY", customId: "back", disabled: page <= 1 }),
            new MessageButton({ emoji: "▶️", style: "SECONDARY", customId: "forward", disabled: end === cases.length })
        );
    const embed = new MessageEmbed()
        .setTitle(`Cases ${start+1} - ${end+1} out of ${cases.length}`)
        .setDescription("Use the `page` option to select different pages")
        .setColor(color);
    cases.slice(start,end).forEach( ({data,index}) => {
        embed.addField(`Case ${index+1}`,renderCase(data,true));
    });
    const reply = await interaction.editReply({ embeds: [embed], components: [buttons] });
    interaction.channel.createMessageComponentCollector({ max: 1, message: reply }).on("collect",buttonAction(page,cases));
}

export async function handler(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    switch (await interaction.options.getSubcommand()) {
        case "get": {
            if (!await hasPermission(interaction.guild,interaction.user.id,PermAction.ViewCase)) {
                await interaction.editReply({ content: permissionError });
                return waitToDeleteInteraction(interaction);
            }
            const caseId = await interaction.options.getInteger("id");
            const caseData = await getCase(interaction.guildId,caseId);
            if (!caseData) {
                await interaction.editReply({ content: errorMessage("That case cannot be found.") });
                return waitToDeleteInteraction(interaction);
            }
            await interaction.editReply({ embeds: [renderCaseEmbed(caseData,caseId)] });
            return waitToDeleteInteraction(interaction);
        }

        case "all": {
            if (!await hasPermission(interaction.guild,interaction.user.id,PermAction.ViewCase)) {
                await interaction.editReply({ content: permissionError });
                return waitToDeleteInteraction(interaction);
            }
            const page = await interaction.options.getInteger("page") ?? 1;
            const allCases = (await getAllCases(interaction.guildId)).reverse();
            paginate(interaction,allCases,page);
            break;
        }

        case "user": {
            if (!await hasPermission(interaction.guild,interaction.user.id,PermAction.ViewCase)) {
                await interaction.editReply({ content: permissionError });
                return waitToDeleteInteraction(interaction);
            }
            const user = (await interaction.options.getUser("user")).id, page = await interaction.options.getInteger("page") ?? 1, allCases = (await getAllUserCases(interaction.guildId,user));
            paginate(interaction,allCases,page);
            break;
        }

        case "mod": {
            if (!await hasPermission(interaction.guild,interaction.user.id,PermAction.ViewCase)) {
                await interaction.editReply({ content: permissionError });
                return waitToDeleteInteraction(interaction);
            }
            const user = (await interaction.options.getUser("user")).id, page = await interaction.options.getInteger("page") ?? 1, allCases = (await getAllModCases(interaction.guildId,user));
            paginate(interaction,allCases,page);
            break;
        }

        case "update": {
            const caseId = await interaction.options.getInteger("case"), caseData = await getCase(interaction.guildId, caseId), reason = await interaction.options.getString("reason");
            if (caseData.user.id !== interaction.user.id && !await hasPermission(interaction.guild,interaction.user.id,PermAction.UpdateCase)) {
                await interaction.editReply({ content: permissionError });
                return waitToDeleteInteraction(interaction);
            }
            const success = await updateCase(interaction.guildId,caseId,reason);
            if (!success) {
                await interaction.editReply({ content: errorMessage("That case could not be found.") });
                return waitToDeleteInteraction(interaction);
            }
            await interaction.editReply({ content: successMessage(`Reason updated to '${reason}'`)});
            return waitToDeleteInteraction(interaction);
        }

        case "expunge": {
            if (!await hasPermission(interaction.guild,interaction.user.id,PermAction.UpdateCase)) {
                await interaction.editReply({ content: permissionError });
                return waitToDeleteInteraction(interaction);
            }
            const success = await expungeCase(interaction.guildId,interaction.options.getInteger("case"));
            if (!success) {
                await interaction.editReply({ content: errorMessage("That case could not be found.") });
                return waitToDeleteInteraction(interaction);
            }
            await interaction.editReply({ content: successMessage(`Case ${interaction.options.getInteger("case")} expunged.`) });
            return waitToDeleteInteraction(interaction);
        }
    }
}
