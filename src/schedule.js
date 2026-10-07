const fs = require('fs')
const path = require('path')

const DAYS_UA = {
    monday: 'Понеділок',
    tuesday: 'Вівторок',
    wednesday: 'Середа',
    thursday: 'Четвер',
    friday: "П'ятниця",
}

// названия классов для сообщений (ключ = имя файла и команды)
const CLASS_NAMES = {
    '11c': '11Г',
    '11b': '11Б',
    '11a': '11А',
    '10c': '10Г',
    '10b': '10Б',
    '10a': '10А',
}

function getClassName(className) {
    return CLASS_NAMES[className] || className
}

function getDayKey(date = new Date()) {
    return date
        .toLocaleDateString('en-US', { weekday: 'long', timeZone: process.env.TIMEZONE })
        .toLowerCase()
}

function getNowTime(date = new Date()) {
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: process.env.TIMEZONE,
    })
}

function loadSchedule(className) {
    const file = path.join(__dirname, '..', 'schedules', `${className}.json`)
    return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function formatLesson(l) {
    return `${l.num}. ${l.start} – ${l.end}  ${l.lesson}`
}

function formatDay(className, dayKey = getDayKey()) {
    const lessons = loadSchedule(className)[dayKey]
    if (!lessons || !lessons.length) return null // выходной или пустой день

    const list = lessons.map(formatLesson).join('\n')

    return `📚 ${DAYS_UA[dayKey]}, ${getClassName(className)}\n\n${list}`
}

// урок, который начинается ровно сейчас (или null)
function getLessonStartingNow(className, dayKey = getDayKey(), time = getNowTime()) {
    const lessons = loadSchedule(className)[dayKey]
    if (!lessons) return null
    return lessons.find((l) => l.start === time) || null
}

module.exports = {
    formatDay,
    formatLesson,
    getDayKey,
    getNowTime,
    loadSchedule,
    getClassName,
    getLessonStartingNow,
}