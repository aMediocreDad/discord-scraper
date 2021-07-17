const fs = require("fs");
const inquirer = require("inquirer");
const SCRAPES = require("./payloads/scraped");

const choices = Object.keys(SCRAPES[0]).map(
	(key) => key[0].toUpperCase() + key.substr(1).replace("_", " ")
);

const promptUser = () =>
	inquirer
		.prompt([
			{
				type: "confirm",
				name: "sort",
				message: "Do you want to sort by date ascending?",
			},
			{
				type: "checkbox",
				name: "selectors",
				message: "What do you want to parse?",
				choices: choices,
				filter(values) {
					return values.map((val) =>
						val.toLowerCase().replace(" ", "_")
					);
				},
			},
		])
		.then((answers) => {
			parseFile(answers);
		})
		.catch((error) => {
			if (error.isTtyError) {
				console.error(
					"Couldn't render interactive session. Using default fallback"
				);
			} else {
				console.error(
					"Failed to parse answers. Using default fallback"
				);
			}
		});

function parseFile(answers) {
	const { sort, selectors } = answers;
	if (sort) SCRAPES.reverse();
	if (!selectors.length) selectors.push("author", "timestamp", "content");
	const returnArray = SCRAPES.map((message) => {
		const parsed = {};
		for (const sel of selectors) {
			parsed[sel] = message[sel];
		}
		return parsed;
	});

	fs.writeFile("./payloads/parsed.json", JSON.stringify(returnArray), (e) => {
		if (e) {
			console.error("Failed to write file");
		} else console.log("Done!");
	});
}

promptUser();
