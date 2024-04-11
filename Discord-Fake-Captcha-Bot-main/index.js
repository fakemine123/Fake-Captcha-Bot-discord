(async () => {
    console.clear()

    const fs = require('node:fs')
    const path = require('node:path')

    process.on('SIGINT', async (code) => {
        try {
            await fs.promises.writeFile(path.join('bot', 'profile', 'channel.json'), JSON.stringify([], null, 2))
            process.exit(1)
        } catch (e) {
            console.log(e)
        }
    })

    await require('./bot/index')()
    await require('./server/index')()
})()