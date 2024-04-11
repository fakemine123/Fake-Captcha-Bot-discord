const fs = require('node:fs')
const path = require('node:path')

const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mention')
        .setDescription('Automatically mention a channel.')
        .addStringOption(option =>
            option.setName('channel')
            .setDescription('The id of the channel you want to mention.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('guild')
            .setDescription('The id of the guild the channel is in.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('time')
            .setDescription('in how many minutes would you like to mention.')
            .setRequired(false)
        ),
    async execute(interaction) {
        const channel = interaction.options.getString('channel')
        const guild = interaction.options.getString('guild')
        const ms = interaction.options.getString('time')

        const dados = JSON.parse(await fs.promises.readFile(path.join('bot', 'profile', 'channel.json')))
        let finder = dados?.find(d => d?.channel === channel)

        if (finder) {
            return await interaction.reply({
                content: `The channel ${channel} is already being mentioned, use the slash /stop command to use this channel again.`,
                ephemeral: true
            })
        }

        const time = ms ? ms * 60000 : 60000

        const guilds = await interaction.client.guilds.fetch(guild)
        if (!guilds) {
            return await interaction.reply({
                content: `The guild ${guild} does not exist.`,
                ephemeral: true
            })
        }

        const channels = await guilds.channels.fetch(channel)
        if (!channels) {
            return await interaction.reply({
                content: `The channel ${channel} does not exist.`,
                ephemeral: true
            })
        }

        dados.push({
            'guild': guild,
            'channel': channel,
            'ms': time
        })

        await fs.promises.writeFile(path.join('bot', 'profile', 'channel.json'), JSON.stringify(dados, null, 2))

        await interaction.reply({
            content: `The channel ${channel} will be mentioned in ${ms ? ms : 1} minute(s).`,
            ephemeral: true
        })

        const st = setInterval(async () => {
            finder = dados?.find(d => d?.channel === channel)
            if (!finder) {
                clearInterval(st)
                return
            }
            try {
                await channels.send('@everyone').then(async (a) => {
                    await a.delete()
                })
            } catch (e) {
                console.log(e)
                clearImmediate(st)
                const contador = dados.findIndex(d => d.channel === channel)
                dados.splice(contador, 1)
                await fs.promises.writeFile(path.join('bot', 'profile', 'channel.json'), JSON.stringify(dados, null, 3))
                return
            }
        }, time)
    },
}