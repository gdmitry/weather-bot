require('dotenv').config();
require('./health-check');

const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('message', (ctx) => {
  if (ctx.message.location) {
    const baseUrl = 'https://weather-services.tomorrow.io/backend/v1/weather/timeline/location';
    const weatherAPIUrl = `${baseUrl}?location=${ctx.message.location.latitude},${ctx.message.location.longitude}`;

    fetch(weatherAPIUrl)
      .then((response) => response.json())
      .then(({ data }) => {
        const msg = `${data.city.name}(${data.city.population}ppl) - ${data.city.state}: ${
          data.autoContent.days[0].next24
        } ${Math.round(data.day1[0].values.temperature)} °C`;
        ctx.reply(msg);
      })
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
