const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Displays information about the minecraft server!')
        .addSubcommand(subcommand => subcommand
            .setName('info')
            .setDescription('Show general information about the SMP and how it runs')
        )
        .addSubcommand(subcommand => subcommand
            .setName('status')
            .setDescription('Check the status of the SMP')
        )
        .addSubcommand(subcommand => subcommand
            .setName('datapacks')
            .setDescription('Show the list of datapacks used on the SMP and links to them')
        )
        .addSubcommand(subcommand => subcommand
            .setName('plugins')
            .setDescription('Show the list of plugins used on the server and links to them')
        ),
    async execute(interaction) {
        try {
            const subcommand = await interaction.options.getSubcommand();
            if (subcommand == 'info') {
                await interaction.reply({ embeds: [ new EmbedBuilder()
                    .setTitle('🎮 Minecraft Server')
                    .setDescription(`
## Guide to Join
1. Request to be whitelisted in <#1368141934065090560>
2. Once accepted, copy the IP from the bottom of this message
3. Connect to the server and have fun!
## Useful Info
- The server is __whitelist only__!
- We have a website, which shows the live player count and the BlueMap!
- There are some datapacks installed, check them out with \`/minecraft datapacks\`
- We also have some neat plugins being used, check those out with \`/minecraft plugins\`
- The server is run on a machine that is not physically accessible, outages happen!
- Effy runs the Minecraft server for free for us all to play, she's amazing!
## Links
- Server IP: \`play.deepstate.gay\`
- Website: https://deepstate.gay
- BlueMap: https://deepstate.gay/map
                    `)
                    .setColor(0xffffff)
                ]});
            } else if (subcommand == 'status') {
                await interaction.deferReply();
                const response = await fetch('https://api.mcsrvstat.us/3/play.deepstate.gay');
                const data = await response.json();
                if (data?.error?.ping) {
                    return await interaction.editReply({ embeds: [ new EmbedBuilder()
                        .setTitle('🎮 Minecraft Server')
                        .setDescription('There was an error with your request.')
                        .setColor(0xe792cb)
                    ]});
                }

                const embed = new EmbedBuilder()
                    .setTitle('🎮 Minecraft Server')
                    .addFields(
                        { name: 'Version', value: data.software + ' ' + data.version, inline: true },
                        { name: 'MOTD', value: '```\n' + (data.motd?.clean || `N/A`) + '\n```' },
                        { name: 'Raw MOTD', value: '```\n' + (data.motd?.raw || `N/A`) + '\n```' },
                    )
                    .setColor((data.online == true) ? 0x43B581 : 0xF04747);
                if (data.players) embed.addFields({ name: 'Players Online (' + data.players.online + '/' + data.players.max + ')', value: (data.players.list) ? ((data.players.list.map(p => p.name).join(', ').length <= 1024) ? data.players.list.map(p => p.name).join(', ') : 'Player list is too large to display.') : ((data.players.online == 0) ? '' : 'This server hides their player list.')})
                
                await interaction.editReply({ embeds: [ embed ] });
            } else if (subcommand == 'datapacks') {
                await interaction.reply({ embeds: [ new EmbedBuilder()
                    .setTitle('🎮 Minecraft Server')
                    .setDescription(`
Age Lock v1.0.0 [Link](https://vanillatweaks.net/picker/datapacks/)
Custom Nether Portals v2.3.18 [Link](https://vanillatweaks.net/picker/datapacks/)
Mini Blocks v1.1.5 [Link](https://vanillatweaks.net/picker/datapacks/)
Painting Picker v1.1.2 [Link](https://vanillatweaks.net/picker/datapacks/)
Player Head Drops v1.1.15 [Link](https://vanillatweaks.net/picker/datapacks/)
Silence Mobs v1.2.9 [Link](https://vanillatweaks.net/picker/datapacks/)
More Mob Heads v2.18.0 [Link](https://vanillatweaks.net/picker/datapacks/)
Oxidize Copper v3.2.2 [Link](https://modrinth.com/datapack/oxidize-copper)
Invisible Item Frames [Link](https://modrinth.com/datapack/tc-invisible-item-frames)
                    `)
                    .setColor(0xffffff)
                ]});
            } else if (subcommand == 'plugins')
                await interaction.reply({ embeds: [ new EmbedBuilder()
                    .setTitle('🎮 Minecraft Server')
                    .setDescription(`
BlueMap [Link](https://modrinth.com/plugin/bluemap)
Chunky [Link](https://modrinth.com/plugin/chunky)
Geyser [Link](https://modrinth.com/plugin/geyser)
GriefPrevention [Link](https://modrinth.com/plugin/griefprevention-3d-subdivisions)
SetHome [Link](https://modrinth.com/plugin/sethome)
Simple_RTP [Link](https://modrinth.com/plugin/simple-rtp)
Sit [Link](https://modrinth.com/plugin/stairsit)
UltimateAutoRestart [Link](https://modrinth.com/plugin/uar)
Simple Voice Chat [Link](https://modrinth.com/plugin/simple-voice-chat)
                    `)
                    .setColor(0xffffff)
                ]});
        } catch (error) { console.log(error); }
    }
}