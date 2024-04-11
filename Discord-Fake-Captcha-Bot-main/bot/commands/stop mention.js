const fs = require('node:fs')
const path = require('node:path')

const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop mentioning a channel.')
        .addStringOption(option =>
            option.setName('channel')
            .setDescription('The id of the channel you want to stop mentioning.')
            .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const channel = interaction.options.getString('channel')

            const dados = JSON.parse(await fs.promises.readFile(path.join('bot', 'profile', 'channel.json')))
            let finder = dados?.find(d => d?.channel === channel)

            if (!finder) {
                return await interaction.reply({
                    content: `The channel ${channel} is not being mentioned.`,
                    ephemeral: true
                })
            }

            const contador = dados.findIndex(d => d.channel === channel)
            dados.splice(contador, 1)

            await fs.promises.writeFile(path.join('bot', 'profile', 'channel.json'), JSON.stringify(dados, null, 2))
            return await interaction.reply({
                content: `The channel ${channel} has stopped being mentioned.`,
                ephemeral: true
            })
        } catch (error) {
            console.log(error)
            return await interaction.reply({
                content: `An error occurred while trying to stop mentioning the channel.`,
                ephemeral: true
            })
        }
    },
};