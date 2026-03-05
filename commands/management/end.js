const { MessageFlags, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

function prettyTime(ms, compress = false) {
    const seconds = ms / 1000;
    const parts = [];

    if (Math.floor(seconds / 31540000) > 0 || compress == false) parts.push(Math.floor(seconds / 31540000) + ((Math.floor(seconds / 31540000) == 1) ? ' year' : ' years'));
    if (Math.floor((seconds % 31540000) / 604800) > 0 || compress == false) parts.push(Math.floor((seconds % 31540000) / 604800) + ((Math.floor((seconds % 31540000) / 604800) == 1) ? ' week' : ' weeks'));
    if (Math.floor(((seconds % 31540000) % 604800) / 86400) > 0 || compress == false) parts.push(Math.floor(((seconds % 31540000) % 604800) / 86400) + ((Math.floor(((seconds % 31540000) % 604800) / 86400) == 1) ? ' day' : ' days'));
    if (Math.floor((((seconds % 31540000) % 604800) % 86400) / 3600) > 0 || compress == false) parts.push(Math.floor((((seconds % 31540000) % 604800) % 86400) / 3600) + ((Math.floor((((seconds % 31540000) % 604800) % 86400) / 3600) == 1) ? ' hour' : ' hours'));
    if (Math.floor(((((seconds % 31540000) % 604800) % 86400) % 3600) / 60) > 0 || compress == false) parts.push(Math.floor(((((seconds % 31540000) % 604800) % 86400) % 3600) / 60) + ((Math.floor(((((seconds % 31540000) % 604800) % 86400) % 3600) / 60) == 1) ? ' minute' : ' minutes'));
    if (Math.round(((((seconds % 31540000) % 604800) % 86400) % 3600) % 60) > 0 || compress == false) parts.push(Math.round(((((seconds % 31540000) % 604800) % 86400) % 3600) % 60) + ((Math.round(((((seconds % 31540000) % 604800) % 86400) % 3600) % 60) == 1) ? ' second' : ' seconds'));
    return parts.join(', ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDescription('Logs out and shuts down the bot')
        .addBooleanOption(option => option
            .setName('force')
            .setDescription('If true, the bot\'s auto restart script will not execute')
            .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const root = path.join(__dirname, '../../');
            const configPath = root + 'config.json';
            const botConfig = JSON.parse(fs.readFileSync(configPath || {}));
            if (botConfig['managementIds'].includes(interaction.user.id)) {
                const force = await interaction.options.getBoolean('force', false) || false;
                await interaction.reply({ embeds: [ new EmbedBuilder()
                    .setTitle('🤖 Shutdown')
                    .setDescription('Shutting down, bye bye')
                    .addFields(
                        { name: 'Uptime', value: prettyTime(process.uptime() * 1000, true) }
                    )
                    .setColor(0xffffff)
                ] });
                await interaction.client.destroy();
                process.exit((force) ? 0 : 1);
            } else {
                await interaction.reply({ embeds: [ new EmbedBuilder()
                    .setTitle('🤖 Shutdown')
                    .setDescription('Only specific permitted users are able to run this command!')
                    .setColor(0xffffff)
                ], flags: MessageFlags.Ephemeral});
            }
        } catch (error) { console.log(error); }
    }
}