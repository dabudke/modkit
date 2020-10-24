console.log('You are running the test command: this will connect to the Discord API with the \
\'testToken\' key in \'token.json\' file.')

exports.token = require("./src/meta/token.json").testToken;
exports.presence = { activity: { name: "for ^help", type: "WATCHING"}, status: "online" };

require("./src/main");