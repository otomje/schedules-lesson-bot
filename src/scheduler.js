const cron = require('node-cron')
const { getUsers } = require('./storage')
const {
    formatDay,
    formatLesson,
    getDayKey,
    getNowTime,
    getLessonStartingNow,
} = require('./schedule')

function startScheduler(bot) {
    // 1) расписание на весь день (08:00, пн–пт)
    cron.schedule(
        '0 8 * * 1-5',
        async () => {
            for (const [chatId, className] of Object.entries(getUsers())) {
                let text
                try {
                    text = formatDay(className)
                } catch (e) {
                    console.error('❎ Нет расписания для', className, e.message)
                    continue
                }
                if (!text) continue
                try {
                    await bot.telegram.sendMessage(chatId, text)
                } catch (e) {
                    console.error('❎ Не отправилось', chatId, e.message)
                }
            }
        },
        { timezone: process.env.TIMEZONE }
    )

    // 2) каждую минуту (пн–пт) если у кого-то сейчас начинается урок, шлём напоминание
    cron.schedule(
        '* * * * 1-5',
        async () => {
            const dayKey = getDayKey()
            const time = getNowTime()

            for (const [chatId, className] of Object.entries(getUsers())) {
                let lesson
                try {
                    lesson = getLessonStartingNow(className, dayKey, time)
                } catch (e) {
                    console.error('❎ Нет расписания для', className, e.message)
                    continue
                }
                if (!lesson) continue
                try {
                    await bot.telegram.sendMessage(chatId, formatLesson(lesson))
                } catch (e) {
                    console.error('❎ Не отправилось', chatId, e.message)
                }
            }
        },
        { timezone: process.env.TIMEZONE }
    )
}

module.exports = { startScheduler }