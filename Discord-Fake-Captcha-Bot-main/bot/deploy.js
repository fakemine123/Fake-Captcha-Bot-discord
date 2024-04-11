const fs = require('node:fs')
const path = require('node:path')

const {
    REST,
    Routes
} = require('discord.js')

const {
    token,
    clientid,
    guildid
} = require('../config')

module.exports = async function () {
    const chalk = (await import('chalk')).default

    const commands = []

    const rd = async (folderPath) => {
        const commandFiles = fs.readdirSync(folderPath)
        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file)
            if (fs.statSync(filePath).isDirectory()) {
                await rd(filePath)
            } else if (file.endsWith('.js')) {
                const command = require(filePath)
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON())
                } else {
                    console.warn(`[-] The command in ${filePath} is missing the required "data" or "execute" properties.`)
                }
            }
        }
    }

    await rd(path.join(__dirname, 'commands'))

    const rest = new REST({
        version: '9'
    }).setToken(token)

    try {
        console.log(chalk.bold.yellow('[!] Registering application commands.'))

        const response = await rest.put(Routes.applicationGuildCommands(clientid, guildid), {
            body: commands
        }, )

        console.log(chalk.bold.green('[+] Registration completed successfully! Application commands (/) registered:', chalk.bold.yellow(response.length)))
    } catch (error) {
        console.error(chalk.bold.red('[-] An error occurred while registering the application commands:'), error)
    }
}