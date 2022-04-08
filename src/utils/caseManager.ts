import { Guild, User } from "discord.js";
import { GuildDb } from "../databases/manager";

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
    }
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
