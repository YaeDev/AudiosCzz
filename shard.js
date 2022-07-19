const { ShardingManager, WebhookClient, MessageEmbed } = require('discord.js')
const { token } = require(`./config.json`)
const data = { id: "925547800614301746", token: "8gF14uKWJshPAn0dPt-A7PqHwhfnsyJjEMqFKpe8Oy_F-HTwdS23EKg4OX8TF0W4vamp"}
const MentionHook = new WebhookClient(data)
const manager = new ShardingManager('./index.js', { token: token, respawn: true})

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`)
    shard.on('ready', () => {
       let embedgreen = new MessageEmbed()
        .setTitle('Shard Status')
        .setDescription('Shard ' + shard.id + ' iniciada com sucesso!\nData: `' + formatted_date() + ' GMT`')
        .setColor('GREEN')
       .setThumbnail('https://media.discordapp.net/attachments/902379674888450121/925553493085945886/image-removebg-preview_5.png')
        console.log('Shard ready')
    
    MentionHook.send({embeds:[embedgreen]})
    })
    shard.on('disconnect', (a, b) => {
          let embeddg = new MessageEmbed()
            .setTitle('Shard Status')
            .setDescription('Shard ' + shard.id + ' com problemas de conexão!\nData: `' + formatted_date() + ' GMT`')
            .setColor('ORANGE') 
            .setThumbnail('https://media.discordapp.net/attachments/886443288767393835/925549042547707914/rooTimeout.png')
    MentionHook.send({embeds:[embeddg]})
        console.log(a)
        console.log(b)
    })
    shard.on('reconnecting', (a, b) => {
         let embeddg = new MessageEmbed()
            .setTitle('Shard Status')
            .setDescription('Shard ' + shard.id + ' está reconectando!\nData: `' + formatted_date() + ' GMT`')
            .setColor('YELLOW') 
            .setThumbnail('https://media.discordapp.net/attachments/886443288767393835/925549042547707914/rooTimeout.png')
    MentionHook.send({embeds:[embeddg]})
        console.log(a)
        console.log(b)
    })
    shard.on('death', (process) => {
         let embeddg = new MessageEmbed()
            .setTitle('Shard Status')
            .setDescription('Shard ' + shard.id + ' obteve um problema fatal!\nData: `' + formatted_date() + ' GMT`\n\n**PID: '  + process.pid + "\nExit code: " + process.exitCode + "**")
            .setColor('RED') 
            .setThumbnail('https://media.discordapp.net/attachments/886443288767393835/925549042547707914/rooTimeout.png')
    MentionHook.send({embeds:[embeddg]})
    })
})
manager.spawn()

  function formatted_date()
  {
   var result="";
   var d = new Date();
   result += d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear() + 
             " "+ d.getHours()+":"+d.getMinutes()+":"+
             d.getSeconds()+"."+d.getMilliseconds();
   return result;
}