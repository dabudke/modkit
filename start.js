const fs = require("fs");
const token = fs.readFile("./token.txt", { encoding: "utf-8" });

console.log("Starting up the bot...");

exports.token = token;
exports.presence = { activity: { name: "the messages flow through | For help, use ^help", type: "WATCHING" }, status: "online" };

console.log("Bot startup complete.  Main script will take over from this point.")

require("./js/main");