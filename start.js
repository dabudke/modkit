console.log("Starting up the bot...");

exports.token = require("./src/meta/token.json").token;
exports.presence = { activity: { name: "the messages flow through | For help, use ^help", type: "WATCHING" }, status: "online" };

console.log("Bot startup complete.  Main script will take over from this point.")

require("./src/main");