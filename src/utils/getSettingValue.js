export function guildSettingValueRaw (guildId, setting) {
    const servers = require("../databases/servers.json");
    return servers[guildId].settings[setting];
}

export function userSettingValueRaw (userId, setting) {
    const users = require("../databases/users.json");
    return users[userId].settings[setting];
}