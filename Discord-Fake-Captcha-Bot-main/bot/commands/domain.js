const fs = require('node:fs')
const path = require('node:path')

const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('domain')
        .setDescription('Change domain to verify CAPTCHA')
        .addStringOption(option => option.setName('domain')
            .setDescription('The domain to verify CAPTCHA')
            .setRequired(true)),
    async execute(interaction) {
        const domain = interaction.options.getString('domain')

        if (!/^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(domain)) {
            return await interaction.reply('Invalid domain, follow this example format: ```captcha.net```')
        } else {
            try {
                const u = require('../profile/domain.json')
                const index = await fs.promises.readFile(path.join('server', 'page', 'verification', 'index.html'), 'utf-8')
                await fs.promises.writeFile(path.join('server', 'page', 'verification', 'index.html'), index.replace(u.url, domain))
                u.url = domain
                await fs.promises.writeFile(path.join('bot', 'profile', 'domain.json'), JSON.stringify(u, null, 3))
                return await interaction.reply({
                    content: `The domain has been changed to: \`${domain}\``,
                    ephemeral: true
                })
            } catch (error) {
                console.log(error)
                return await interaction.reply({
                    content: `An error occurred while trying to change the domain.`,
                    ephemeral: true
                })
            }
        }
    },
};