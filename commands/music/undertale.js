const { QueryType } = require('discord-player');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    name: 'undertale',
    aliases: ['ut'],
    utilisation: '{prefix}undertae',
    voiceChannel: true,

    async execute(client, message, args) {
  
      // play
        const res = await client.player.search('https://www.youtube.com/playlist?list=PLvJE24xlovhuuhaQInNsjRyRF8QdFnh6V', {
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

        queue.setVolume(0);
        if (!queue.playing) await queue.play();
      
      // Warten für 4 Sekunden
          setTimeout(function() {
      // shuffle
            const success = queue.shuffle();
            return message.channel.send(`Queue has been shuffled! ✅`);
                }, 4000);
      
      // Warten für 4 Sekunden (0 Sekunden danach)
          setTimeout(function() {
            // loop queue:
            const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

            return message.channel.send(success ? `Loop Mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**, The whole sequence will repeat non-stop 🔁` : `${message.author}, Something went wrong. ❌`);
        
                }, 4001);
      
            // Warten für 4 Sekunden (0 Sekunden danach)
          setTimeout(function() {
      // skip
            const success = queue.skip();
                }, 4002);
            // Warten für 8 Sekunden (4 Sekunden danach)
          setTimeout(function() {
      // skip
            const success = queue.skip();
            queue.setVolume(100);
                }, 8000);

            // Warten für 9 Sekunden (1 Sekunde danach)
          setTimeout(function() {
      // shuffle
            const success = queue.shuffle();
                }, 9000);
    },
};