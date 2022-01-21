const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const { VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const { token } = require('./config.json');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});

const channel = bot.channels.cache.get("790788636886040656");
    
const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
});

connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
	console.log('Connection is in the Ready state!');
});

player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
	console.log('Audio player is in the Playing state!');
});

player.on('error', error => {
	console.error('Error:', error.message);
});

const resource = createAudioResource('./audio.mp3');
player.play(resource);

bot.on('ready', () =>  {
    bot.user.setActivity("감독", { type: "PLAYING" });
    console.log(bot.user.tag);

    const subscription = connection.subscribe(player);

    if (subscription) {
        setTimeout(() => subscription.unsubscribe(), 5_000);
    }
});

function testing() {

}

bot.login(token);