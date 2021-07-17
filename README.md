# Discord Text Scraper

This is a simple scraper that relies on node.js fetch requests.

## Warning!

Using this scraper can be classified as a self-bot, and [Discord has a fairly firm stance on self-bots](https://support.discord.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots-). Use at your own discretion.

## How To

Clone or download the repo, `cd` into it and run `npm ci`.

To get the correct headers, open up Discord, activate _Developer Mode_, and open the _Developer Tools_ `CTRL/CMD + SHIFT + I`.

Navigate to the channel you want to scrape, then open the _Network_-tab in the _Developer Tools_. Scroll a bit up and down the channels chat log until an _XHR_ request that starts with **messages?** is visible (E.g. `messages?limit=50` or `messages?before={hash}&limit=50`).

Right-click this one and click `Copy -> Copy as Node.js fetch`.

You should have something that looks like this:

```json
fetch("https://discord.com/api/v9/channels/{channelId}/messages?limit=50", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US",
    "authorization": "mfa.{authtoken}",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-super-properties": "{hash}",
    "cookie": "{hash}"
  },
  "referrer": "https://discord.com/channels/{guildId}/{channelId}",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors"
});
```

Separate the _URI_ and the _Options object_ into the config-template.json like so:

```json
	"URI": "{https://discord.com/api/v9/channels/{channelId}}",
	"options": {
		"headers": {"..."},
		"..."
		"method": "GET",
		"mode": "cors"
	}
```

Finally rename the file to `config.json` and run `npm run scrape`. After some time a _JSON_ file called `scrapedMessages.json` should now appear in the working directory.
