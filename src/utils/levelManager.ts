import { Message } from "discord.js";
import { getLocalGuild, updateLocalGuild } from "../databases/manager";

const BaseUpThreshhold = 100;
const Cooldown = 60000

function calculateGain ( timeElapsed: number ) {
    return 10 - Math.floor((timeElapsed - Cooldown) / ( Cooldown / 2 ));
}

export function updateLevel (msg: Message): void {
    const LGuild = getLocalGuild(msg.guild.id);

    if (!LGuild.points.has(msg.author.id)) {
        LGuild.points.set(msg.author.id, { level: 1, points: 0, lastUpdated: 0 });
        console.log(LGuild.points.get(msg.author.id));
    }
    const GuildPoints = LGuild.points.get(msg.author.id);
    const TimeElapsed = Date.now() - GuildPoints.lastUpdated
    if (TimeElapsed > 0) {
        const Calculated = calculateGain(TimeElapsed);
        GuildPoints.points += Calculated > 10 ? Calculated : 10;
        GuildPoints.lastUpdated = Date.now();
        if (GuildPoints.points >= BaseUpThreshhold * (GuildPoints.level / 2)) {
            GuildPoints.points -= BaseUpThreshhold * (GuildPoints.level / 2);
            GuildPoints.level += 1;
            // start levelup message
            const MessageSettings = LGuild.settings.pointNotificationChannel;
            if ( MessageSettings.value == "same" ) {
                msg.channel.send(`Good job, <@${msg.member.nickname && "!"}${msg.author.id}>!  You've reached level ${GuildPoints.level}`);
            }
        }
        LGuild.points.set(msg.author.id, GuildPoints);
    }
    console.log(LGuild.points.get(msg.author.id));
    LGuild.points.set(msg.author.id, GuildPoints);

    updateLocalGuild(msg.guild.id, LGuild);
}
