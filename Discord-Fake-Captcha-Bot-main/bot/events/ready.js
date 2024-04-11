const fs = require('node:fs')
const path = require('node:path')

module.exports = {
    name: 'ready',
    async execute(client) {
        const chalk = (await import('chalk')).default

        try {
            console.log(chalk.bold.green('[+] Logged in as'), chalk.bold.yellow(client.user.tag))

            const set = require('../profile/config.json')
            if (set.pfp === true) return

            await client.user.setAvatar(path.join('bot', 'profile', 'f43bfe6b62b3c38002b3c1cb5100a11a.jpg'))
            console.log(chalk.bold.green('[-] Profile picture has been set.'))

            await fs.promises.writeFile(path.join('bot', 'profile', 'config.json'), JSON.stringify({
                pfp: true
            }), null, 3)
        } catch (e) {
            console.error(chalk.bold.red('An error occurred while setting the profile picture:'), e)
        }
    },
}