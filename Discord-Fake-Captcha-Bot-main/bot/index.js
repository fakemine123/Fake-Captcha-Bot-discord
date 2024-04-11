const fs = require('node:fs')
const path = require('node:path')

const {
    Client,
    GatewayIntentBits,
    Collection
} = require('discord.js')

const {
    token
} = require('../config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences
    ],
})

module.exports = async function () {
    const chalk = (await import('chalk')).default

    await require('./deploy')()

    client.commands = new Collection()

    async function l(dir) {
        const files = fs.readdirSync(dir)
        for (const file of files) {
            const fullPath = path.join(dir, file)
            const stat = fs.lstatSync(fullPath)
            if (stat.isDirectory()) {
                await l(fullPath)
            } else if (file.endsWith('.js')) {
                const command = require(fullPath)
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command, client)
                } else {
                    console.log(chalk.bold.red(`[-] ${fullPath} does not have the required properties.`))
                }
            }
        }
    }

    async function c(dir) {
        const files = fs.readdirSync(dir)
        for (const file of files) {
            const fullPath = path.join(dir, file)
            const stat = fs.lstatSync(fullPath)
            if (stat.isDirectory()) {
                await c(fullPath)
            } else if (file.endsWith('.js')) {
                const event = require(fullPath)
                if ('name' in event && 'execute' in event) {
                    client.on(event.name, (...args) => event.execute(...args, client))
                } else {
                    console.log(chalk.bold.red(`[-] ${fullPath} does not have the required properties.`))
                }
            }
        }
    }

    await l(path.join(__dirname, 'commands'))
    await c(path.join(__dirname, 'events'))

    client.login(token)
}