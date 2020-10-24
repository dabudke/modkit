exports.execute = ( msg, args, db ) => {
    if ( args[0] === undefined ) {
    msg.reply("you can submit feedback to the developers of Ally!  Put your feedback after `feedback` or `fb` to submit feedback.");
    } else {
        let feedback = args[0];
        let i = false;
        for (const arg in args) {
            if (!i) { i = true; } else {
                feedback = feedback.concat(" ").concat(args[arg]);
            }
        }
        db.feedbackDb.push(feedback);
        msg.reply("thanks for submitting feedback!  Your feedback is important, so keep submitting feedback as needed!");
    }
}

exports.helpEmbed = ( message, prefix, name, version ) => {
	return({
		title: `${prefix}feedback (feedback)`,
		description: `Send feedback to the developers of ${name}.`,
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
				value: `${prefix}fb`
			}
		],
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username} | ${name} v${version}`,
			icon_url: message.author.avatarURL
		}
	})
}