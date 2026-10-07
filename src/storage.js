const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'data', 'users.json')

function load() {
    try {
        return JSON.parse(fs.readFileSync(FILE, 'utf8'))
    } catch {
        return {}
    }
}

function setUserClass(chatId, className) {
    const users = load()
    users[chatId] = className
    fs.mkdirSync(path.dirname(FILE), { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(users, null, 2))
}

function getUsers() {
    return load()
}

function removeUser(chatId) {
    const users = load()
    if (!users[chatId]) return false // не был подписан
    delete users[chatId]
    fs.writeFileSync(FILE, JSON.stringify(users, null, 2))
    return true
}

function getUserClass(chatId) {
    return load()[chatId] || null
}

module.exports = { setUserClass, getUsers, removeUser, getUserClass }