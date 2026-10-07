const { Telegraf } = require('telegraf')
// const { message } = require('telegraf/filters')
// const fs = require('fs')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const { setUserClass, removeUser, getUserClass } = require('./src/storage')
const { startScheduler } = require('./src/scheduler')
const { getClassName } = require('./src/schedule')

bot.start((ctx) => ctx.reply(`
🖐 Привет. Этот бот создан для того, чтобы отправлять в рабочие дни расписание занятий, а также напоминать о начале уроков чтобы не пропустить их.
\n📃 Пожалуйста, выбери класс в котором ты учишься из списка:\n/11b
\n🛑 Чтобы остановить рассылку, напиши: /stop
`))

bot.command('stop', (ctx) => {
    if (removeUser(ctx.chat.id)) {
        ctx.reply(`✅ Рассылка остановлена. Чтобы подписаться снова, выбери класс в котором ты учишься из списка:\n/11b`)
    } else {
        ctx.reply(`❎ Ты и так не подписан на рассылку. Чтобы подписаться, выбери класс в котором ты учишься из списка:\n/11b`)
    }
})

bot.command('11b', (ctx) => {
    if (getUserClass(ctx.chat.id) === '11b') {
        return ctx.reply(`❎ Ты уже подписан на расписание ${getClassName('11b')}`)
    }
    setUserClass(ctx.chat.id, '11b')
    ctx.reply(`✅ Теперь ты подписан на расписание ${getClassName('11b')}`)
})

bot.telegram.setMyCommands([
    { command: 'start', description: 'Начать работу с ботом' },
    { command: '11b', description: 'Подписаться на расписание 11Б' },
    { command: 'stop', description: 'Остановить рассылку' },
])

startScheduler(bot)
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))