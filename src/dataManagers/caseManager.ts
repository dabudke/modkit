import { Guild, MessageEmbed, Snowflake, User } from "discord.js";
import { usernameAndTagWithId } from "../utils/userToString";
import { getGuild, updateGuild } from "./database";

export type Case = number;

export enum ActionType { Message = "Message", Channel = "Channel", User = "User" }
export interface BaseAction {
    type: ActionType,
    subType: SubActionType,
    user: BasicUser,
    date: number;
    reason?: string,
}

export enum MessageActionType { Delete = "Deleted", Purge = "Purged", Edit = "Edited" }
export interface MessageAction extends BaseAction {
    type: ActionType.Message,
    subType: MessageActionType,

    text?: string,
    count?: number
}

export enum ChannelActionType { Lock = "Locked", Restrict = "Restricted", Slowmode = "Slowmode Toggled" }
export interface ChannelAction extends BaseAction {
    type: ActionType.Channel,
    subType: ChannelActionType,

    channel: Snowflake
}

export enum UserActionType { Ban = "Banned", Tempban = "Temporarily Banned", Kick = "Kicked", Timeout = "Timed Out", Warn = "Warned" }
export interface UserAction extends BaseAction {
    type: ActionType.User,
    subType: UserActionType

    target: BasicUser
}

export type SubActionType = MessageActionType | ChannelActionType | UserActionType;
export type Action = MessageAction | ChannelAction | UserAction;
export type InPlaceAction = { data: BaseAction, index: Case };

const actionReverseMap: Record<SubActionType,ActionType> = {
    [ChannelActionType.Lock]: ActionType.Channel,
    [ChannelActionType.Restrict]: ActionType.Channel,
    [ChannelActionType.Slowmode]: ActionType.Channel,
    
    [MessageActionType.Delete]: ActionType.Message,
    [MessageActionType.Edit]: ActionType.Message,
    [MessageActionType.Purge]: ActionType.Message,
    
    [UserActionType.Ban]: ActionType.User,
    [UserActionType.Kick]: ActionType.User,
    [UserActionType.Tempban]: ActionType.User,
    [UserActionType.Timeout]: ActionType.User,
    [UserActionType.Warn]: ActionType.User,
};

export type BasicUser = {
    username: string,
    tag: string,
    id: Snowflake,
    pfp: string
}

export async function addCase(guild: Guild, user: User, action: ChannelActionType, date: Date, data: Snowflake, reason?: string): Promise<Case>;
export async function addCase(guild: Guild, user: User, action: MessageActionType, date: Date, data: string | number, reason?: string): Promise<Case>;
export async function addCase(guild: Guild, user: User, action: UserActionType, date: Date, data: User, reason?: string): Promise<Case>;

export async function addCase(guild: Guild, user: User, action: SubActionType, date: Date, data: unknown, reason?: string): Promise<Case> {
    const caseData: BaseAction = {
        type: actionReverseMap[action],
        subType: action,
        user: {
            id: user.id,
            username: user.username,
            tag: user.tag,
            pfp: user.avatarURL()
        },
        date: date.getTime(),
        reason: reason
    };

    switch (caseData.type) {
        case ActionType.Channel: caseData["channel"] = data; break;
        case ActionType.Message:
            if (action == MessageActionType.Purge) caseData["count"] = data;
            else caseData["text"] = data;
            break;
        case ActionType.User: caseData["target"] = {
            id: data["id"],
            username: data["username"],
            tag: data['tag'],
            pfp: data["avatarURL"]()
        }; break;
    }

    const lGuild = await getGuild(guild.id), caseId = lGuild.cases.push(caseData);
    updateGuild(guild.id,lGuild);
    // send log message
    return caseId;
}

export async function getAllCases(guildId: Snowflake): Promise<InPlaceAction[]> {
    return (await getGuild(guildId)).cases.map((v,i) => ({ data: v, index: i }));
}

export async function getCases(guildId: Snowflake, end: number, start = 0): Promise<InPlaceAction[]> {
    return (await getGuild(guildId)).cases.slice(start, end).map((v,i) => ({ data: v, index: i }));
}

export async function getCase(guildId: Snowflake, caseId: Case): Promise<BaseAction> {
    return (await getGuild(guildId)).cases[caseId -1];
}

export async function getAllUserCases(guildId: Snowflake, userId: Snowflake): Promise<InPlaceAction[]> {
    return (await getAllCases(guildId)).filter(({data}) => data["target"] && data["target"]["id"] == userId);
}
export async function getAllModCases(guildId: Snowflake, userId: Snowflake): Promise<InPlaceAction[]> {
    return (await getAllCases(guildId)).filter(({data}) => data.user.id == userId);
}

export async function updateCase(guildId: Snowflake, caseId: Case, reason: string): Promise<boolean> {
    const lGuild = await getGuild(guildId);
    if (!lGuild.cases[caseId-1]) return false;
    lGuild.cases[caseId-1].reason = reason;
    updateGuild(guildId,lGuild);
    return true;

}

export async function expungeCase(guildId: Snowflake, caseId: Case): Promise<boolean> {
    const lGuild = await getGuild(guildId);
    if (!lGuild.cases[caseId-1]) return false;
    lGuild.cases[caseId-1] = null;
    updateGuild(guildId,lGuild);
    return true;
}

const colors: Record<SubActionType,number> = {
    [ChannelActionType.Lock]: 0,
    [ChannelActionType.Restrict]: 0,
    [ChannelActionType.Slowmode]: 0,
    
    [MessageActionType.Delete]: 0,
    [MessageActionType.Edit]: 0,
    [MessageActionType.Purge]: 0,
    
    [UserActionType.Ban]: 0,
    [UserActionType.Kick]: 0,
    [UserActionType.Tempban]: 0,
    [UserActionType.Timeout]: 0,
    [UserActionType.Warn]: 0
};

export function renderCaseEmbed(data: BaseAction, id: Case): MessageEmbed {
    return new MessageEmbed()
        .setTitle(`Case ${id}`)
        .setDescription(renderCase(data))
        .setColor(colors[data.subType])
        .setTimestamp(data.date);
}

export function renderCase(data: BaseAction, date = false): string {
    if (data === null) return "Case expunged.";
    return `**${data.type} ${data.subType}** by ${usernameAndTagWithId(data.user)}\n**Reason:** ${data.reason ?? "*none given*"}${data["target"] ? `\n**Target:** ${usernameAndTagWithId(data["target"])}` : ""}${date ? `\n**Date:** <t:${Math.floor(data.date / 1000)}:d> <t:${Math.floor(data.date / 1000)}:t>` : ""}`;
}
