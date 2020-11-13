const about = require("../meta/about.json");
const database = require("../utils/databaseManager");

exports.execute = ( message, args ) => {
    if ( args[0] === undefined ) {
		message.reply("you can submit feedback to the developers of Ally!  Put your feedback after `feedback` or `fb` to submit feedback.");
    } else {
        let feedback = args[0];
        let i = false;
        for (const arg in args) {
            if (!i) { i = true; } else {
                feedback = feedback.concat(" ").concat(args[arg]);
            }
        }
        database.feedbackDb.push(feedback);
        message.reply("thanks for submitting feedback!  Your feedback is important, so keep submitting feedback as needed!");
    }
}

exports.helpEmbed = ( message ) => {
	return({
		title: `${about.prefix}feedback (feedback)`,
		description: `Send feedback to the developers of ${about.name}.`,
		url: "https://allydiscord.github.io/docs/commands/utility/feedback/",
		color: 0x0099FF,
		thumbnail: {
			url: "https://imgur.com/YVRMcUD.png"
		},
		fields: [
			{
				name: "feedback - Feedback to give.",
				value: "**Required.**  Feedback to send to the authors."
			},
			{
				name: "Alternate Command:",
				value: `${about.prefix}fb`
			}
		],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${about.name} v${about.version}`,
			icon_url: message.author.avatarURL
		}
	})
}