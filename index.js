const { Client, Intents, MessageEmbed, MessageButton, MessageActionRow, Collector, Interaction, Channel} = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const { AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const { token } = require('./config.json');

const TARGET_GUILD = "783625320062386217";

const TARGET_TEXT_CHANNEL = "935885611599024148";
const TARGET_VOICE_CHANNEL = "935885631010246706";

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
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
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
});

bot.on('messageCreate', (msg) => {
    if (msg.content === "시이험 시이ㅣㅣ작!") {
        start_test();
    }
});


const subject_title = ["국어", "수학", "외국어"];

function break_time(num, channel) {
    return new Promise((resolve) => {
        play_start_bell();
        channel.bulkDelete(100);
        channel.send({ embeds: [
            new MessageEmbed({
                title: `쉬는 시간`,
                description: `쉬는 시간 입니다. 쉬세요~\n쉬면서 다음 시험 준비를 부탁드립니다.`,
                fields: [
                    { name: "이전 교시", value: (num-1) == -1 ? "없음" : `${subject_title[num-1]} 영역`, inline: true},
                    { name: "다음 교시", value: (num == 2) ? "없음" : `${subject_title[num]} 영역`, inline: true} 
                ],
                color: '#ffC0CB'
            })
        ]})
        setTimeout(() => {
            resolve();
        }, 600000) // 600000ms = 10min
    });
}

function main_time(num, time, channel) {
    return new Promise((reslove) => {
        play_start_bell(num);
        channel.bulkDelete(100);
        let start = new Date();
        let end = new Date();
        end.setMinutes(start.getMinutes() + time);
        channel.send({
            embeds: [
                new MessageEmbed({
                    title: `[${num+1}교시] ${subject_title[num]} 영역`,
                    description: `${subject_title[num]} 영역 시험이 시작되었습니다.`,
                    fields: [
                        { name: `시험 시간 (${time}분)`, value: `${start.toTimeString().split(' ')[0]} ~ ${end.toTimeString().split(' ')[0]}` }
                    ],
                    color: '#ffC0CB'
                })
            ]
        });
        setTimeout(() => {
            reslove();
        }, time*60000);
    })
}

function play_start_bell(num) {
    if (num == 2) //외국어 영역일 경우
        next_music="./sounds/2021.03.listentest.mp3"
    player.play(createAudioResource("./sounds/school_bell.mp3"))
    connection.subscribe(player);
}

async function start_test() {
    JoinChannel(TARGET_VOICE_CHANNEL);
    const channel = bot.channels.cache.get(TARGET_TEXT_CHANNEL);
    await break_time(2, channel);
    await main_time(2, 70, channel);
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