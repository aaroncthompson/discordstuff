const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// permissions - channels and roles
let isMANAGE_CHANNELS =
  (context.params.event.member.permissions & (1 << 4)) === 1 << 4;
  
if (isMANAGE_CHANNELS) {
  let messageId = context.params.event.data.options[0].value; // required 
  if ( typeof context.params.event.data.options[1] !== 'undefined') {
    var channelId = context.params.event.data.options[1].value
  } else {
    var channelId = `1049102286430945280`;
  }
  
  await lib.discord.channels['@0.1.1'].messages.destroy({
    message_id:  messageId,
    channel_id: channelId
  });
  await lib.discord.channels['@0.1.2'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: `✔️ | <@${context.params.event.member.user.id}> - Post ${messageId} has been deleted!`
  });

} else {
  await lib.discord.channels['@0.1.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `❌ | You don't have permission to run that command, <@!${context.params.event.member.user.id}>`,
    });
}
