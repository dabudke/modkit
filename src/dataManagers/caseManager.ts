import { Guild, MessageEmbed, Snowflake, User } from "discord.js";
import { getGuild, updateGuild } from "./database";
import { usernameAndTagWithId } from "../utils/userToString";
import { getSettingValue } from "./settingManager";

export enum Action {
    Purge,
    Warn,
    Kick,
    Ban,
    Unban,
    Timeout,
    ViewCases,
    UpdateCase,
    ExpungeCase,
    Settings
}

export const Colors: Record<Action, number> = {
    [Action.Purge]: 0x7621ff,
    [Action.Warn]: 0xffd321,
    [Action.Kick]: 0xff7621,
    [Action.Ban]: 0xff1919,
    [Action.Unban]: 0x51ff21,
    [Action.Timeout]: 0xff21c0,
    [Action.ViewCases]: 0x000000,
    [Action.UpdateCase]: 0x000000,
    [Action.ExpungeCase]: 0x000000,
    [Action.Settings]: 0x000000,
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

export type BasicUser = {
    username: string,
    tag: string,
    id: Snowflake
}

export type CaseId = number;
export interface CaseInfo {
    type: Action,
    user: BasicUser,
    target?: BasicUser,
    date: Date
    reason?: string,
    endDate?: Date,
}
export type CaseData = CaseInfo | null;

export async function newCase (guild: Guild, user: User, action: Action, reason?: string, target?: User, endDate?: Date): Promise<CaseId> {
    const data: CaseData = {
        type: action,
        user: { id: user.id, tag: user.tag, username: user.username },
        target: target ? { id: target.id, tag: target.tag, username: user.username } : null,
        date: new Date(),
        reason: reason,
        endDate: endDate
    }, lGuild = await getGuild(guild.id), caseId = lGuild.cases.push(data);
    updateGuild(guild.id,lGuild);
    sendLogMessage(caseId,data,guild);
    return caseId;
}

export async function getCases(guildId: Snowflake): Promise<{ data: CaseData, index: CaseId }[]> {
    const lGuild = await getGuild(guildId);
    return lGuild.cases.map((v,i) => {
        return {
            data: v,
            index: i
        };
    });
}

export async function getCase(guildId: Snowflake, caseId: CaseId): Promise<CaseData> {
    const lGuild = await getGuild(guildId);
    return lGuild.cases[caseId -1];
}

export async function getTargetCases(guildId: Snowflake, userId: Snowflake): Promise<{ data: CaseData, index: CaseId }[]> {
    const allCases = await getCases(guildId);
    return allCases.filter( ({ data }) => data.target && data.target.id === userId );
}
export async function getModCases(guildId: Snowflake, userId: Snowflake): Promise<{ data: CaseData, index: CaseId }[]> {
    const allCases = await getCases(guildId);
    return allCases.filter( ({ data }) => data.user.id === userId );
}

export async function updateCase(guildId: Snowflake, caseId: CaseId, reason: string): Promise<boolean> {
    const lGuild = await getGuild(guildId);
    const caseData = lGuild.cases[caseId -1];
    if (!caseData) return false;
    caseData.reason = reason;
    lGuild.cases[caseId -1] = caseData;
    updateGuild(guildId, lGuild);
    return true;
}

export async function expungeCase(guildId: Snowflake, caseId: CaseId): Promise<boolean> {
    const lGuild = await getGuild(guildId);
    if (!lGuild.cases[caseId-1]) return false;
    lGuild.cases[caseId-1] = null;
    updateGuild(guildId,lGuild);
    return true;
}

const logSetting: Record<Action,string> = {
    [Action.Purge]: "modlog.sendMessagePurgeLogs",
    [Action.Warn]: "modlog.sendUserWarnLogs",
    [Action.Kick]: "modlog.sendUserKickMessage",
    [Action.Ban]: "modlog.sendUserBanMessage",
    [Action.Unban]: "modlog.sendUserUnbanMessage",
    [Action.Timeout]: "modlog.sendUserTimeoutMessage",
    [Action.ViewCases]: "",
    [Action.UpdateCase]: "",
    [Action.ExpungeCase]: "",
    [Action.Settings]: "",
};

async function sendLogMessage(id: CaseId, caseData: CaseData, guild: Guild) {
    if (!getSettingValue(guild.id,"modlog.enabled")) return;
    if (!getSettingValue(guild.id,logSetting[caseData.type])) return;
    const channel = guild.channels.resolve(await getSettingValue<Snowflake>(guild.id,"modlog.channel"));
    if (!channel) return;
    if (!channel.isText()) return;
    channel.send({ embeds: [renderCaseEmbed(caseData,id)] });
}

export function renderCaseEmbed(caseData: CaseData, id: CaseId): MessageEmbed {
    return new MessageEmbed()
        .setTitle(`Case ${id}`)
        .setDescription(renderCase(caseData))
        .setColor(Colors[caseData.type])
        .setTimestamp(caseData.date);
}

export function renderCase(caseData: CaseData,date: boolean = false): string {
    if (caseData === null) return "Case expunged.";
    return `**${ActionText[caseData.type]}** issued by ${usernameAndTagWithId(caseData.user)}\n**Reason:** ${caseData.reason ?? "*none given*"}${caseData.target ? `\n**User:** ${usernameAndTagWithId(caseData.target)}` : ""}${date ? `\n**Date:** <t:${Math.floor(caseData.date.getTime() / 1000)}:d> <t:${Math.floor(caseData.date.getTime() /1000)}:t>` : ""}`;
}
