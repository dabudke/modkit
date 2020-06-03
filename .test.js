console.log('You are running the test command: this will connect to the Discord API with the\
\'testToken\' key in \'token.json\' file.')

exports.token = require("./meta/token.json").testToken;
exports.presence = { activity: { name: "around with the fabric of Discord", type: "PLAYING"}, status: "dnd" };

require("./src/main");