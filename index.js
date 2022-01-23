const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const { AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const { token } = require('./config.json');

const TARGET_GUILD = "783625320062386217";

const TARGET_VOICE_CHANNEL = "870182484426506270";
const TARGET_TEXT_CHANNEL = "";

let connection;
let next_music;
let loof_music;
let player = createAudioPlayer({ 
    behaviors: { 
        noSubscriber: NoSubscriberBehavior.Pause, 
    }, 
});
const bot = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,   
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ] 
});

player.on(AudioPlayerStatus.Idle, () => {
    if (loof_music != undefined && connection != undefined) {
        player.play(createAudioResource(loof_music));
        connection.subscribe(player);
    } else if (next_music != undefined && connection != undefined) {
        player.play(createAudioResource(next_music));
        connection.subscribe(player);
        next_music = undefined;
    }
});

function JoinChannel(channelId) {
    const channel = bot.channels.cache.get(channelId);
    connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
}

bot.on('ready', () =>  {
    bot.user.setActivity("감독", { type: "PLAYING" });
    console.log(bot.user.tag);

    JoinChannel(TARGET_VOICE_CHANNEL);
    loof_music = "./sounds/test_music.mp3";
    player.play(createAudioResource(loof_music));
    connection.subscribe(player);

    // JoinChannel(TARGET_VOICE_CHANNEL);
    // let resource = createAudioResource('./sounds/test_music.mp3');
    // player.play(resource);
    // connection.subscribe(player);
    // next_resource = createAudioResource('./sounds/audio.mp3');
});

bot.on('messageCreate', (msg) => {
    if (msg.content === "get out") {
        connection.destroy();
    } else if (msg.content === "get in") {
        connection = JoinChannel(msg.member.voice.channel.id)
    } else if (msg.content === "play") {
        let resource = createAudioResource('./sounds/test_music.mp3', { inlineVolume: true });
        resource.volume.setVolume(0.2);
        player.play(resource);
        connection.subscribe(player);
    } else if (msg.content === "stop") {
        player.stop();
    } else if (msg.content.startsWith("eval")) {
        const splited = msg.content.split('|');
        try { msg.reply(`\`\`\`${eval(splited[1])}\`\`\``); }
        catch(e) { msg.reply(`\`\`\`${e}\`\`\``); }
    } else if (msg.content === "move me") {
        msg.member.voice.setChannel(bot.channels.cache.get(TARGET_VOICE_CHANNEL));
    } else if (msg.content === "바나나야 닥쳐") {
        const target_guild = bot.guilds.cache.get(TARGET_GUILD);
        const target_user = target_guild.members.cache.get("689003151239807138");
        try {
            target_user.voice.setMute(true);
        } catch (e) {
            console.log(`권한이 없음`);
        }
    } else if (msg.content === "바나나야 말해") {
        const target_guild = bot.guilds.cache.get(TARGET_GUILD);
        const target_user = target_guild.members.cache.get("689003151239807138");
        try {
            target_user.voice.setMute(false);
        } catch (e) {
            console.log(`권한이 없음`);
        }
    } else if (msg.content.startsWith("기타빌런 처단")) {
        const target_guild = bot.guilds.cache.get(TARGET_GUILD);
        const target_user = target_guild.members.cache.get("749471568530374727");
        try {
            target_user.voice.setMute(true);
        } catch (e) {
            console.log(`권한이 없음`);
        }
    } else if (msg.content.startsWith("기타빌런 풀어주기")) {
        const target_guild = bot.guilds.cache.get(TARGET_GUILD);
        const target_user = target_guild.members.cache.get("749471568530374727");
        try {
            target_user.voice.setMute(false);
        } catch (e) {
            console.log(`권한이 없음`);
        }
    }
});

function break_time() {
    return new Promise((resolove) => {
        setTimeout(() => {
            resolove
        }, 600000)
    }) 
}

function start_test() {
    setTimeout(() => {
        
    }, 4800000);
}


bot.login(token);

// 종소리 후보 : 
// https://www.youtube.com/watch?v=Po1KhTI9fgw&list=PLDu6Rx1MyPyYJ7Gim7Hr0a39w55qK3-Rn&index=14
// https://www.youtube.com/watch?v=3vrHpOZ80dU&list=PLDu6Rx1MyPyYJ7Gim7Hr0a39w55qK3-Rn&index=15
// https://www.youtube.com/watch?v=WSP0lfmLA6M&list=PLDu6Rx1MyPyYJ7Gim7Hr0a39w55qK3-Rn&index=22
// https://www.youtube.com/watch?v=BRRCpx0t8rM&list=PLDu6Rx1MyPyYJ7Gim7Hr0a39w55qK3-Rn&index=23

// 알림음 후보 : 
// https://www.youtube.com/watch?v=IKLE-UYNtVE&list=PLDu6Rx1MyPyYJ7Gim7Hr0a39w55qK3-Rn&index=25

// ms 시간표
// 국어 영역 : 4800000ms
// 수학 영역 : 6000000ms
// 외국어 영역 : 4200000ms
// 쉬는 시간 : 600000ms