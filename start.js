console.log("Starting up the bot...");

exports.token = require("./meta/token.json").token;
exports.presence = { activity: { name: "the messages flow in through Discord", type: "WATCHING" }, status: "online" };

console.log("Bot startup complete.  Main script will take over from this point.")

require("./src/main");