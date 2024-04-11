const {
    ownerid
} = require('../../config')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const chalk = (await import('chalk')).default

        if (!interaction.isChatInputCommand()) return

        if (!ownerid.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            })
        }

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            console.error(chalk.bold.red(`[-] No command matching ${interaction.commandName} was found.`))
            return
        }

        try {
            await command.execute(interaction, client)
        } catch (error) {
            console.error(error)

            const errorMessage = {
                content: 'There was an error executing this command!',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage)
            } else {
                await interaction.reply(errorMessage)
            }
        }
    }
}