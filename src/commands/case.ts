import { ChatInputApplicationCommandData, CommandInteraction, MessageEmbed } from "discord.js";
import { Action, CaseData, CaseId, Colors, getCase } from "../utils/caseManager";
import { usernameAndTagWithId } from "../utils/userToString";

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

const ActionText: Record<Action, string> = {
    [Action.Purge]: "Purge",
    [Action.Warn]: "Warning",
    [Action.Kick]: "Kick",
    [Action.Ban]: "Ban",
    [Action.Unban]: "Unban",
    [Action.Timeout]: "Timeout",
    [Action.ViewCases]: "you cant see this haha",
    [Action.UpdateCase]: "source code warrior",
    [Action.ExpungeCase]: "ohoho delete lol",
    [Action.Settings]: "setting change aahahah",
};

export async function handler(interaction: CommandInteraction) {
    const hidden = interaction.options.getBoolean("hidden") ?? true;
    await interaction.deferReply( { ephemeral: hidden });
    switch (await interaction.options.getSubcommand()) {
        case "one": {
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
}

export function renderCase(caseData: CaseData): string {
    if (caseData === null) return "Case expunged.";
    return `**${ActionText[caseData.type]}** issued by ${usernameAndTagWithId(caseData.user)}\n**Reason:** ${caseData.reason ?? "*none given*"}${caseData.target ? `\n**User:** ${usernameAndTagWithId(caseData.target)}` : ""}`;
}
