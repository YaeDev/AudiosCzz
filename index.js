//UPTIME CALLBACK

let { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

const http = require('http');
const fs = require('fs')
const express = require('express');
const app = express();
var server = http.createServer(app);
const Discord = require("discord.js")
const { Intents, Collection, Client } = require("discord.js")
const Command = require("./structures/Command.js");
      const intents = new Discord.Intents(643);
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES
]});
const db = require('quick.db')
const moment = require('moment')
const { prefix, token, YTCK } = require('./config.json');
let ms = require("parse-ms")
app.get("/", (request, response) => {
const ping = new Date();
ping.setHours(ping.getHours() - 3);
console.log(`Ping foi entregue ás ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
response.sendStatus(200);
});
app.listen(process.env.PORT);
const { Structures } = require('discord.js');
const path = require('path');
const { loadSlashCommands } = require("./handler/handler");
client.commands = new Collection();
client.slash = new Collection();

loadSlashCommands(client)





//CHAGELOG//
client.on("ready", async() => {
  let ta = db.fetch(`ta_933479660354957363`) || 0
  let guild = await client.guilds.fetch("933479660354957363")

  let pid = new MessageButton().setCustomId("pedir").setStyle("SUCCESS").setLabel("🎙️ Pedir ID")
  let row = new MessageActionRow().addComponents(pid)

  setInterval(function() {
  ta = db.fetch(`ta_933479660354957363`) || 0
  let texts = [
      `🔉 ${ta} áudios solicitados!`,
      `🎉 Temos ${guild.members.cache.size} membros!`
   ]
  console.log("[ACTIVITY] Changed text")
  client.user.setActivity(texts[Math.floor(Math.random() * texts.length)])
  }, 15000)
})


client.on('interactionCreate', async interaction => {
  if(interaction.isButton()) {
    if(interaction.customId == "pedir") {
      const thread = await interaction.channel.threads.create({
        name: `🆔 ${interaction.member.user.id}`,
        autoArchiveDuration: 60,
        type: 'GUILD_PRIVATE_THREAD',
        reason: 'Criado para pedir ID',
      });		
      console.log("PASS")
      await thread.join()
      interaction.reply({content: "Thread criada em <#" + thread.id + ">", ephemeral: true})
      await thread.members.add(interaction.member.user.id);
      let embed = new  MessageEmbed()
      .setTitle("Insira o link da música")
      .setDescription("Mande abaixo o link da música que deseja ser convertida para o ROBLOX. Use `cancelar` para cancelar a operação")
      .setColor("ORANGE")
      .setTimestamp()  
      let msg5 = await thread.send({content: `<@${interaction.member.user.id}>`, embeds:[embed]})
      const filter2 = collected => collected.author.id === interaction.member.user.id;
           msg5.channel.awaitMessages({ filter: filter2, max: 1, time: 60000, errors: ['time'] })
         .then(async collected =>  {
           msg5.delete()
           const response = collected.first().content
           if(response.toLowerCase() == "cancelar") return await thread.delete()
           db.add(`ta_933479660354957363`, 1)
           let pid = new MessageButton().setCustomId("pick").setStyle("SUCCESS").setLabel("Pick")
           let row = new MessageActionRow().addComponents(pid)
           let embed = new MessageEmbed()
           .setAuthor(`Pedido de ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
           .setColor("RED")
           .addField("Música", response)
           .setTimestamp()
           thread.send("Pedido realizado com sucesso!")
           let msg6 = await interaction.guild.channels.cache.get("998729252331606096").send({embeds:[embed], components: [row]})
           const collector = msg6.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });
	
           collector.on('collect',async i => {
            if(!i.member.roles.cache.has("988489769610776657")) return i.deferUpdate()
            let embed = new MessageEmbed()
            .setAuthor(`Pedido de ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
            .setColor("ORANGE")
            .addField("Música", response)
            .setTimestamp()
            const thread = await i.channel.threads.create({
              name: `⛑️ ${i.member.user.id}`,
              autoArchiveDuration: 60,
              type: 'GUILD_PRIVATE_THREAD',
              reason: 'Criado para confirmar entrega',
            });		
            console.log("PASS")
            await thread.join()
            i.reply({content: "Thread criada em <#" + thread.id + ">", ephemeral: true})
            await thread.members.add(i.member.user.id);
            msg6.edit({embeds:[embed], components:[]})
            let dmembed = new MessageEmbed()
            .setTitle("Confirme a entrega")
            .setDescription("Para finalizar, clique no botão abaixo e em seguida, confirme o ID da música.")
            .setTimestamp()
            .setColor("ORANGE")
            let pid = new MessageButton().setCustomId("entr").setStyle("SUCCESS").setEmoji("✅")
            let row = new MessageActionRow().addComponents(pid)
            let msg7 = await thread.send({embeds:[dmembed], components:[row]})
            const collector = msg7.createMessageComponentCollector({ componentType: 'BUTTON', time: 1200000 });
	
            collector.on('collect',async i => {
              msg7.delete()
              let msg5 = await thread.send({content: `Envie o ID da música.`, })
              const filter2 = collected => collected.author.id === interaction.member.user.id;
                   msg5.channel.awaitMessages({ filter: filter2, max: 1, time: 60000, errors: ['time'] })
                 .then(async collected =>  {
                   msg5.delete()
                   await thread.setLocked(true)
                   const response = collected.first().content
                   let dmembed = new MessageEmbed()        
                   .setTitle("Entrega confirmada!")
                   .setDescription("A entrega foi confirmada, abaixo, está o ID da música solicitada!")
                   .setTimestamp()
                   .addField(`ID`, response)
                   .setColor("GREEN")
                   thread.send({embeds: [dmembed]})
                   interaction.member.user.send({embeds:[dmembed]})
                   let embed = new MessageEmbed()
                  .setAuthor(`Pedido de ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                  .setColor("GREEN")
                  .addField("Música", response)
                  .setTimestamp()
                  msg6.edit({embeds:[embed]})
                  setTimeout(async function() {
                    await thread.delete()
                   }, 5000)
                 })
            })

          })
           await thread.setLocked(true); 
           setTimeout(async function() {
            await thread.delete()
           }, 5000)
         })
    }
  }

})

client.on('interactionCreate', async interaction => {
  console.log(interaction.commandName)
  const { OwnerID } = require('./config.json')
 
  if (!interaction.isCommand()) return;

      const command = client.slash.get(interaction.commandName);
      if (!command) return interaction.reply({ content: 'an Erorr' });
      if (command.inMaintence) {
          if (interaction.member.user.id != OwnerID) {
              return interaction.reply('⛑️ *Comando em manutenção! Tente novamente mais tarde.*')
          }
      }
        try {

          command.run(interaction, client)
      } catch (e) {
          interaction.reply({ content: e.message });
      }
  
})


client.login(token);