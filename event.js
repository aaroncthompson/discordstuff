const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// permissions - channels and roles
let isMANAGE_CHANNELS =
  (context.params.event.member.permissions & (1 << 4)) === 1 << 4;
  
if (isMANAGE_CHANNELS) {

// set variables
  let eventname = context.params.event.data.options[0].value;
  let description = context.params.event.data.options[1].value;
// image is optional, has a default value
  if ( typeof context.params.event.data.options[2] !== 'undefined') {
    var image = context.params.event.data.options[2].value
  } else {
    var image = `https://i.imgur.com/UFKuOHC.png`;
  }
  if ( typeof context.params.event.data.options[3] !== 'undefined') {
    var emoji = context.params.event.data.options[3].value
  } else {
    var emoji = `:white_check_mark:`;
  }
  if ( typeof context.params.event.data.options[4] !== 'undefined') {
    var channelId = context.params.event.data.options[4].value
  } else {
    var channelId = `1049102286430945280`; // #rsvp
//    var channelId = `1047779404622856192`; // #bot-junk
  }

// generate a random role name
  let theRole = Math.floor(Math.random() * 1000000);

// create role
  let newRole = await lib.discord.guilds['@0.1.0'].roles.create({
    name: `${theRole}`,
    guild_id: `${context.params.event.guild_id}`,
    color: 131644,
    hoist: false,
    mentionable: true,
  });

// create post
  let theMessage = await lib.discord.channels['@0.1.1'].messages.create({
    channel_id: channelId,
    content: '',
    tts: false,
    embed: {
      type: 'rich',
      title: eventname,
      description: description + "\n\nClick "+emoji+" **(once it appears)** if you would like to attend!",
      color: 131644,
      image: {
        url: image,
        height: 0,
        width: 0,
      },
      footer: {
        text: "Clicking the react will opt you into the event channel.",
      },
    },
  });

// get channel parent category id
  const categoryName = `events`;
  let channels = await lib.discord.guilds['@0.0.2'].channels.list({
    guild_id: context.params.event.guild_id,
  });
  let targetCategory = channels.find((channel) => {
    return channel.name.toLowerCase().indexOf(categoryName.toLowerCase()) > -1;
  });

// create the channel
  await lib.discord.guilds['@0.2.0'].channels.create({
    guild_id: `${context.params.event.guild_id}`,
    parent_id: targetCategory.id,
    name: `${eventname}`,
    topic: `${description}`,
    type: 0,
    permission_overwrites: [
      { // deny everyone
        id: `${context.params.event.guild_id}`,
        type: 0, // by role
        deny: `${1 << 10}`,
      },
      { // allow the author
        id: `${context.params.event.member.user.id}`,
        type: 1, // by user
        allow: `${1 << 10}`,
      },
      { // allow the specified role
        id: newRole.id,
        type: 0, // by role
        allow: `${1 << 10}`,
      },
    ],
  });
  
//  await lib.discord.channels['@0.2.0'].messages.create({
//    channel_id: `${context.params.event.channel_id}`,
//    content: `\`&rr add ${channelId} ${theMessage.id} ${emoji} ${newRole.name}\``,
//  });

// confirmation
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `✔️ | <@${context.params.event.member.user.id}>`,
    embed: {
      type: 'rich',
      title: "Event \""+eventname+"\" created!\nCopy and paste the following:",
      description: `\`&rr add ${channelId} ${theMessage.id} ${emoji} ${newRole.name}\``,
      color: 131644,
    },
  });

} else {
  await lib.discord.channels['@0.1.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `❌ | You don't have permission to run that command, <@!${context.params.event.member.user.id}>`,
    });
}
