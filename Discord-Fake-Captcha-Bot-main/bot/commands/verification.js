const {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    EmbedBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verification')
        .setDescription('Sends the captcha verification message.')
        .addStringOption(option =>
            option
            .setName('server')
            .setDescription('server id')
            .setRequired(true))
        .addStringOption(option =>
            option
            .setName('channel')
            .setDescription('channel id')
            .setRequired(true)),
    async execute(interaction, client) {
        const domain = (require('../profile/domain.json')).url

        if (domain === 'youapihere') {
            return interaction.reply({
                content: 'You need to change the domain first. Use the command `/domain` to change it.',
                ephemeral: true
            })

        }

        const d = interaction.options.getString('server')
        const c = interaction.options.getString('channel')

        const guild = client.guilds.cache.get(d)
        if (!guild) {
            return interaction.reply({
                content: 'The server was not found, check if the server is valid.',
                ephemeral: true
            })
        }

        const channel = guild.channels.cache.get(c)
        if (!channel) {
            return interaction.reply({
                content: 'The channel was not found, check if the channel is valid.',
                ephemeral: true
            })
        }

        const row_1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('disabled')
            .setLabel(`ONLY verify on ${domain}`)
            .setStyle('Secondary')
            .setDisabled(true)
        )

        const row_2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('verify')
            .setLabel('Verify')
            .setEmoji('🤖')
            .setStyle('Primary'),
            new ButtonBuilder()
            .setCustomId('why')
            .setLabel('Why?')
            .setStyle('Secondary')
        )

        const embed = new EmbedBuilder()
            .setTitle('🤖 Verification required')
            .setDescription(`To gain access to ${'`' + guild.name + '`'} you need to prove you are a human by completing a captcha. Click the button below to get started!`)
            .setColor('#336B8C')
            .setTimestamp()

        try {
            await channel.send({
                'embeds': [embed],
                'components': [row_1, row_2],
            })
            return await interaction.reply({
                content: `The verification message has been sent to ${channel.name}.`,
                ephemeral: true
            })
        } catch (error) {
            console.log(error)
            return await interaction.reply({
                content: `An error occurred while trying to send the verification message.`,
                ephemeral: true
            })
        }
    },
};