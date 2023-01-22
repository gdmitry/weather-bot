require('dotenv').config();

require('./health-check');
const { saveUser } = require('./db');

const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');

const { API_URL, BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome! Please send location to see weather!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('message', (ctx) => {
  const locationData = ctx.message.location;
  if (locationData) {
    const weatherAPIUrl = `${API_URL}?location=${locationData.latitude},${locationData.longitude}`;

    fetch(weatherAPIUrl)
      .then((response) => response.json())
      .then(({ data }) => {
        const msg = `${data.city.name}(${data.city.population}ppl) - ${data.city.state}: ${
          data.autoContent.days[0].next24
        } ${Math.round(data.day1[0].values.temperature)}°C`;
        ctx.reply(msg);

        return {
          name: ctx.from.username,
          location: locationData,
        };
      })
      .then(saveUser)
      .catch(function (err) {
        console.log('Unable to fetch -', err);
      });
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Bot started!');
