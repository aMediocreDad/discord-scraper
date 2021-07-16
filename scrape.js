const axios = require("axios").default;
const fs = require("fs");
const CONFIG = require("./config");

const fetchOptions = CONFIG.options;
const fetchURI = (beforeId) => {
	const before = `before=${beforeId}&`;
	return `${CONFIG.URI}/messages?${beforeId ? before : ""}limit=100`;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let scrapeArray = [];
let beforeId = "";
let done = false;

async function scrape() {
	const response = await axios(fetchURI(beforeId), fetchOptions)
		.then((res) => res.data)
		.catch((e) => console.error("Failed Fetch: ", e));
	beforeId = response[response.length - 1]?.id;
	if (!response || !response.length) done = true;
	else scrapeArray = [...scrapeArray, ...response];
	return;
}

async function scrapeAndStore() {
	while (done === false) {
		await delay(Math.ceil(Math.random() * 100));
		await scrape();
	}
	if (!scrapeArray.length) return console.warn("Nothing found!");
	const jsonObj = JSON.stringify(scrapeArray);
	fs.writeFile("./scrapedMessages.json", jsonObj, (e) => {
		if (!e) {
			console.log("Done!");
		}
	});
}

scrapeAndStore();
