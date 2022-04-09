import { Guild, Snowflake, User } from "discord.js";
import { GuildDb } from "../databases/manager";
import { usernameAndTagWithId } from "./userToString";

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

export type CaseId = number;
export interface CaseInfo {
    type: Action,
    user: User,
    target?: User,
    date: Date
    reason?: string,
    endDate?: Date,
}
export type CaseData = CaseInfo | null;

export function newCase (guild: Guild, user: User, action: Action, reason?: string, target?: User, endDate?: Date): CaseId {
    const data: CaseData = {
        type: action,
        user: user,
        target: target,
        date: new Date(),
        reason: reason,
        endDate: endDate
    };

    const lGuild = GuildDb.get(guild.id);

    switch (action) {
        case Action.Warn: {
            const caseId = lGuild.modHistory.push(data);
            if (!lGuild.userModHistory.has(target.id)) {
                lGuild.userModHistory.set(target.id, []);
            }
            const lUser = lGuild.userModHistory.get(target.id);
            lUser.push(caseId);
            lGuild.userModHistory.set(target.id, lUser);
            GuildDb.update(guild.id, lGuild);
            // sendLogMessage(guild, case);
            return caseId;
        }

        case Action.Purge: {
            const caseId = lGuild.modHistory.push(data);
            GuildDb.update(guild.id, lGuild);
            // sendLogMessage(guild, case);
            return caseId;
        }
    }
}

export async function getCases(guildId: Snowflake): Promise<{ data: CaseData, index: CaseId }[]> {
    const lGuild = GuildDb.get(guildId);
    return lGuild.modHistory.map((v,i) => {
        return {
            data: v,
            index: i
        };
    });
}

export async function getCase(guildId: Snowflake, caseId: CaseId): Promise<CaseData> {
    const lGuild = GuildDb.get(guildId);
    return lGuild.modHistory[caseId -1];
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
    const lGuild = GuildDb.get(guildId);
    const caseData = lGuild.modHistory[caseId -1];
    if (!caseData) return false;
    caseData.reason = reason;
    lGuild.modHistory[caseId -1] = caseData;
    GuildDb.update(guildId, lGuild);
    return true;
}

export async function expungeCase(guildId: Snowflake, caseId: CaseId): Promise<boolean> {
    const lGuild = GuildDb.get(guildId);
    if (!lGuild.modHistory[caseId-1]) return false;
    lGuild.modHistory[caseId-1] = null;
    GuildDb.update(guildId,lGuild);
    return true;
}

// export function sendLogMessage (punishment: Punishment, guild: Guild): void {
//     const GuildSettings = GuildDb.get(guild.id).settings;
//     if (!GuildSettings.modLogChannel.value) return;
//     const LogChannel = guild.channels.resolve(GuildSettings.modLogChannel.value as string);
//     if (!LogChannel) return;
//     if (!LogChannel.isText()) return;

//     let embed: MessageEmbed;
//     let extraFields: EmbedFieldData[];

//     switch (punishment.type) { // punishment-specific fields set in here
//         case PunishmentType.Warning:
//             if (!GuildSettings.logUserWarns.value) return;
//             embed = new MessageEmbed();
//             embed.setColor(0xFFFF00);
//             embed.setAuthor("User Warned", punishment.user.avatarURL());
//     }

//     embed.setTimestamp(new Date());
//     embed.addFields([
//         {
//             name: "Punished User",
//             value: `${punishment.user.username}#${punishment.user.discriminator} (${punishment.user.id})`
//         },
//         {
//             name: "Reason",
//             value: punishment.reason ? punishment.reason : "None given",
//             inline: true
//         },
//         {
//             name: "Punishing User",
//             value: `${punishment.punisher.username}#${punishment.punisher.discriminator} (${punishment.punisher.id})`,
//             inline: true
//         }
//     ]);
//     if (extraFields) embed.addFields(extraFields);

//     // LogChannel.send({ embed: embed });
// }

export function renderCase(caseData: CaseData): string {
    if (caseData === null) return "Case expunged.";
    return `**${ActionText[caseData.type]}** issued by ${usernameAndTagWithId(caseData.user)}\n**Reason:** ${caseData.reason ?? "*none given*"}${caseData.target ? `\n**User:** ${usernameAndTagWithId(caseData.target)}` : ""}`;
}
