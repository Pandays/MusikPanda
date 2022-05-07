const { QueryType } = require('discord-player');
const { QueueRepeatMode } = require('discord-player');
const maxVol = require("../../config.js").opt.maxVol;

module.exports = {
    name: 'wideputin',
    aliases: ['wp'],
    utilisation: '{prefix}wideputin',
    voiceChannel: true,
    showHelp: false,
  
    async execute(client, message, args) {

        const res = await client.player.search('https://www.youtube.com/watch?v=RHRKu5mStNk', {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return message.channel.send(`${message.author}, No results found! ❌`);

        const queue = await client.player.createQueue(message.guild, {
            metadata: message.channel
        });
      
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            await client.player.deleteQueue(message.guild.id);
            return message.channel.send(`${message.author}, I can't join the audio channel. ❌`);
        }

        await message.channel.send(`Your ${res.playlist ? 'Playlist' : 'Track'} is loading now... 🎧`);

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
      
            // Warten für 4 Sekunden
          setTimeout(function() {
            // loop track:
            const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
            
            return message.channel.send(success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, Current music will be repeated non-stop (all music in the list **${client.config.px}loop queue**  You can repeat it with the option.) 🔂` : `${message.author}, Something went wrong ❌`);
        
                }, 4000);
      
      // Warten für 4 Sekunden (0 Sekunden danach)
          setTimeout(function() {
      		queue.setVolume(200);
            
        return message.channel.send(`Volume changed to **200** (maximum is **${maxVol}**) 🔊`) ;
                }, 4001);
    },
};