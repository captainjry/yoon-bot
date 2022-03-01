const { Client, Intents } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const { createDiscordJSAdapter } = require('./adapter');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('with granny yoon')
});

client.on('messageCreate', async message => {
  console.log(message.member.user)
  const channel = message.member.voice.channel;
  const text = message.content

  if (text === 'ping') {
    message.reply('ปิงอีก ปิงแม่งเข้าไป')
    return
  } else if (text.includes('yoon'.toLowerCase())) {
    handleYoonMessage(message)
    return
  }
		
  if (text.startsWith('.rand')) {
    const items = text.split(' ').slice(1)
    if (items.length > 0) message.reply(items[Math.floor(Math.random()*items.length)])
    return
  }

  if (!channel) {
     return
  }
  if (text === '.bruh' || text.startsWith('.ยูน') || text.startsWith('.หลานยายยูน') || text.startsWith('.ปิออกไปดิ') || text.startsWith('.ปิสอนเชิง')) {
    try {
      const connection = await connectToChannel(message);
      console.log(text)
      if (text === '.bruh') {
        playSong(connection, './assets/voices/capohobrother.mp3')
      } else if (text.startsWith('.ยูน')) {
        playSong(connection, './assets/voices/edgaryoon.m4a')
      } else if (text.startsWith('.หลานยายยูน')) {
        playSong(connection, './assets/voices/New_Recording_2.mp3')
      } else if (text.startsWith('.ปิออกไปดิ')) {
        playSong(connection, './assets/voices/poomout.mp3')
      } else if (text.startsWith('.ปิสอนเชิง')) {
        playSong(connection, './assets/voices/poomteaching.mp3')
      } else if (text.startsWith('.กระจอก')) {
        playSong(connection, './assets/voices/kk_i_here.mp3')
      }
    } catch (error) {
      console.error(error);
    }
  }
});

const connectToChannel = async message => {
  const connection = joinVoiceChannel({
		channelId: message.member.voice.channel.id,
		guildId: message.member.voice.guild.id,
		adapterCreator: createDiscordJSAdapter(message.member.voice.channel),
	});

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

const playSong = (connection, path) => {
  const resource = createAudioResource(path, { inputType: StreamType.Arbitrary });
  const p = createAudioPlayer();
  p.play(resource);
  entersState(p, AudioPlayerStatus.Playing, 5e3);
  connection.subscribe(p);
}

const handleYoonMessage = (message) => {
  const username = message.member.user.username
  switch (username) {
    case 'BABAEVSKI':
    case 'ตัวฉันอีกคนนึง':
      message.reply('ควายเก๋')
      return
    case 'Peem':
      message.reply('ควายสมิท')
      return
    case 'ZEpalZ':
      message.reply('ชลวิทอิอิ')
      return
    case 'KKrazy':
      message.reply('ควายกระหรี่ชาญเวท')
      return  
    case 'oam':
      message.reply('ว่าไงสุดหล่อ')  
      return
    case 'earth':
      message.reply('รักนุ้ก')
      return;  
    default:
      message.reply('ควายลูกอีโง่')
  }
}

client.login(process.env.TOKEN)
