var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var chrono = require('chrono-node');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
	res.send("|0ng|1ve|moger|sqd");
});

app.get('/oauth', function(req, res) {
	if (!req.query.code) {
		res.status(500);
		res.send({"error": "Looks like we're not getting code."});
		console.log("Looks like we're not getting code.");
	} else {
		request({
			url: 'https://slack.com/api/oauth.access',
			qs: {code: req.query.code, client_id: process.env.SLACK_ID, client_secret: process.env.SLACK_SECRET},
			method: 'GET',
		}, function (error, response, body) {
			if (error) {
				console.error(error);
			} else {
				res.json(body);
			}
		})
	}
});

app.post('/sc', function(req, res) {
	var d = chrono.parseDate(req.body.text);
	console.log(JSON.stringify(chrono.parse(req.body.text)));
	if (d) {
		res.send(`Here's your crontab! Make sure to replace things you don't want with \`*\`.\n\`\`\`\n${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth()+1} * <command>\n\`\`\`\nHere's a reference to help you out.\n\`\`\`\n<minute> <hour> <day of month> <month of execution> <day of week> <command>\`\`\`\nYou can use either day of month or day of week to specify the execution date. Replace the unused one with the \`*\` wildcard.\nYou could use the \`*\` wildcard to mean "every", and use commas to specify multiple values in the same field.`);
	} else {
		res.send(`It doesn't seem like you've provided a valid date or time.`);
	}
});

app.listen(7460, function() {
	console.log(`Listening for requests on port 7460.`);
});