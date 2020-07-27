console.log('You are running the test command: this will connect to the Discord API with the\
\'testToken\' key in \'token.json\' file.')

exports.token = require("./meta/token.json").testToken;
exports.presence = { activity: { name: "the latest code changes", type: "STREAMING"}, status: "online" };

require("./src/main");