import { GuildMember, User } from "discord.js";
import { BasicUser } from "../dataManagers/caseManager";

export function username(user: User | BasicUser, bold = true): string {
    return `${bold ? "**" : ""}${user.username}${bold ? "**" : ""}`;
}

export function usernameWithId(user: User | BasicUser, bold = true): string {
    return `${bold ? "**" : ""}${user.username}${bold ? "**" : ""} (${user.id})`;
}

export function usernameAndTag(user: User | BasicUser): string {
    return `**${user.tag}**`;
}

export function usernameAndTagWithId(user: User | BasicUser): string {
    return `**${user.tag}** (${user.id})`;
}

export function displayName(user: GuildMember): string {
    return `**${user.displayName}**`;
}

export function displayNameWithId(user: GuildMember): string {
    return `**${user.displayName}** (${user.id})`;
}

export function displaynameAndTag(user: GuildMember): string {
    return user.nickname ? `**${user.nickname}** (${user.user.tag})` : `**${user.user.tag}**`;
}

export function displaynameAndTagWithId(user: GuildMember): string {
    return user.nickname ? `**${user.nickname}** (${user.user.tag} *${user.id}*)` : `**${user.user.tag}** (${user.id})`;
}
