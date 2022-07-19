const db = require('quick.db')
const { MessageEmbed, IntegrationApplication } = require('discord.js')
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
module.exports = {
	name: "avaliar",
	description: "Avalie sua experiência aqui!",
	category: "fun",
	aliases: ["marry"],
	inMaintence: false,
  //Code
	run: async(interaction, client) => {
		let aval = 0
		let num1 = new MessageButton().setStyle("DANGER").setCustomId("1").setEmoji("1️⃣");let num2 = new MessageButton().setCustomId("2").setStyle("SECONDARY").setEmoji("2️⃣");
		let num3 = new MessageButton().setStyle("PRIMARY").setCustomId("3").setEmoji("3️⃣");let num4 = new MessageButton().setCustomId("4").setStyle("PRIMARY").setEmoji("4️⃣");
		let num5 = new MessageButton().setEmoji("5️⃣").setStyle("SUCCESS").setCustomId("5");

		let author = interaction.member.user.id
		const thread = await interaction.channel.threads.create({
			name: `🆔 ${author}`,
			autoArchiveDuration: 60,
			type: 'GUILD_PRIVATE_THREAD',
			reason: 'Criado para avaliação',
		});		
		console.log("PASS")
		await thread.join()
		interaction.reply({content: "Thread criada em <#" + thread.id + ">", ephemeral: true})
		await thread.members.add(author);
		let embed = new MessageEmbed()
		 .setTitle("Bem-vindo")
		 .setDescription("Selecione abaixo uma opção para continuarmos sua avaliação!")
		 .setColor("RANDOM")
		 .setTimestamp()
		 .setFooter("©️ Áudios Czz | 2022")

		 let painel = new MessageActionRow()
		 .addComponents(
		   new MessageSelectMenu()
		   .setCustomId(`menu`)
		   .setPlaceholder("🔎 Clique aqui para começar")
			.addOptions([
						{
					   label: 'Servidor',
					   description: 'Avalie o servidor de uma maneira geral',
					   emoji: '👥',
					   value: 'servidor',
					  },
					  {
					   label: 'Pedido',
					   description: 'Avalie um pedido de id realizado',
					   emoji: '🧾',
					   value: 'pedido',
					  },
					  {
						label: 'Cancelar',
						description: 'Cancela a operação e fecha a thread',
						emoji: '🛑',
						value: 'cancelar',
					   }
				   ])
	   
		 )
		let msg = await thread.send({content:`<@${author}>`, embeds:[embed], components:[painel]})
		const collector = msg.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60000 });

		collector.on('collect', async i => {
			msg.delete()
		if(i.values[0] == "servidor") {
			let embed = new MessageEmbed().setTitle("Design").setColor("DARK_ORANGE").setTimestamp().setDescription("Reagindo nos botões abaixo, qual sua nota de 1 a 5 para o design dos canais e cargos do servidor?")
			let row = new MessageActionRow().addComponents(num1, num2, num3, num4, num5)
			let msg2 = await thread.send({content:`<@${author}>`, embeds:[embed], components:[row]})
			const collector = msg2.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });
	
			collector.on('collect',async i => {
				msg2.delete()
				aval = aval + Number(i.customId)
				let embed = new MessageEmbed().setTitle("Staff").setColor("DARK_ORANGE").setTimestamp().setDescription("Reagindo nos botões abaixo, qual sua nota de 1 a 5 para o comportamento da staff em relação ao servidor?")

			let row = new MessageActionRow().addComponents(num1, num2, num3, num4, num5)
			let msg3 = await thread.send({content:`<@${author}>`, embeds:[embed], components:[row]})
			const collector = msg3.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });
	
			collector.on('collect',async i => {
				msg3.delete()
				aval = aval + Number(i.customId)
				let embed = new MessageEmbed().setTitle("Qualidade dos IDs").setColor("DARK_ORANGE").setTimestamp().setDescription("Reagindo nos botões abaixo, qual sua nota de 1 a 5 para os IDS fornecidos de maneira geral (qualidade, preferências, etc)")
			let row = new MessageActionRow().addComponents(num1, num2, num3, num4, num5)
			let msg4 = await thread.send({content:`<@${author}>`, embeds:[embed], components:[row]})
			const collector = msg4.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });
	
			collector.on('collect',async i => {
				msg4.delete()
				aval = aval + Number(i.customId)
				await thread.setLocked(true); 
				let finalaval = aval / 3
				let finalaval2 = Math.round(finalaval)
				console.log("[NOTA} " + finalaval + "("  + finalaval2 + ")")
				let finalav = finalaval.toString()
				let embed = new MessageEmbed().setTitle("Nota do avaliador").setColor("DARK_ORANGE").setTimestamp().setDescription("Escreva abaixo sua sugestão ou seu feedback para o servidor, pode mencionar um usuário também!")
				let msg5 = await thread.send({content: `<@${interaction.member.user.id}>`, embeds:[embed]})
				const filter2 = collected => collected.author.id === interaction.member.user.id;
					   msg5.channel.awaitMessages({ filter: filter2, max: 1, time: 60000, errors: ['time'] })
					 .then(async collected =>  {
					   msg5.delete()
					   const response = collected.first().content
				let embed = new MessageEmbed().setTitle("Finalizado").setColor("GREEN").setTimestamp().setDescription("Obrigado! Abaixo está o resultado da avaliação (lembrando que os valores são arrendodados, então pode ser que eles não estejam totalmente corretos!)").addField("Avaliação", `${finalav.substring(0,4)} (${"⭐".repeat(finalaval2) + "<:2b50:998707684528361582>".repeat(5 - finalaval2)})`).addField("Nota do avaliador", response)
			    let avembed = new MessageEmbed().setAuthor("Avaliação de " + interaction.member.user.tag, interaction.member.user.displayAvatarURL({dynamic: true})).setColor("RED").setTimestamp()
				.addField("Avaliação", `${finalav.substring(0,4)} (${"⭐".repeat(finalaval2) + "<:2b50:998707684528361582>".repeat(5 - finalaval2)})`)
				.addField("Nota do avaliador", response)
				thread.send({embeds:[embed]})
				interaction.guild.channels.cache.get("998380875144232980").send({embeds:[avembed]})
				db.add(`nota_${interaction.guild.id}`, aval / 3)
				db.add(`notas_${interaction.guild.id}`, 1)
				let totalnota = Number(db.fetch(`nota_${interaction.guild.id}`))
				let notas = db.fetch(`notas_${interaction.guild.id}`)
				let finaltopic = Math.round(totalnota / notas)
				let nota = totalnota / notas
				nota = nota.toString()
				nota = nota.substring(0,4)
				console.log(finaltopic)
				interaction.guild.channels.cache.get("998380875144232980").setTopic(`Nota total dos avaliadores: ${nota} (${"⭐".repeat(finaltopic) + "<:2b50:998707684528361582>".repeat(5 - finaltopic)})`)
				setTimeout(async function() {
					await thread.delete()
				}, 5000)
			 })

			})
			})
		})	  
		}
		if(i.values[0] == "pedido") {
		let embed = new MessageEmbed().setTitle("Agilidade").setColor("DARK_ORANGE").setTimestamp().setDescription("Reagindo nos botões abaixo, qual sua nota de 1 a 5 para a rapidez da finalização do pedido?")
		let row = new MessageActionRow().addComponents(num1, num2, num3, num4, num5)
		let msg2 = await thread.send({content:`<@${author}>`, embeds:[embed], components:[row]})
		const collector = msg2.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });

		collector.on('collect',async i => {
			msg2.delete()
			aval = aval + Number(i.customId)
			let embed = new MessageEmbed().setTitle("Atendimento").setColor("DARK_ORANGE").setTimestamp().setDescription("Dê uma nota para o atendimento do pedido (praticidade ao pedir, ajuda prestada caso dada por um staff, etc)")

		let row = new MessageActionRow().addComponents(num1, num2, num3, num4, num5)
		let msg3 = await thread.send({content:`<@${author}>`, embeds:[embed], components:[row]})
		const collector = msg3.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });

		collector.on('collect',async i => {
			msg3.delete()
			aval = aval + Number(i.customId)
			let embed = new MessageEmbed().setTitle("Qualidade dos IDs").setColor("DARK_ORANGE").setTimestamp().setDescription("Reagindo nos botões abaixo, qual sua nota de 1 a 5 para os IDS fornecidos de maneira geral (qualidade, preferências, etc)")
		let row = new MessageActionRow().addComponents(num1, num2, num3, num4, num5)
		let msg4 = await thread.send({content:`<@${author}>`, embeds:[embed], components:[row]})
		const collector = msg4.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });

		collector.on('collect',async i => {
			msg4.delete()
			aval = aval + Number(i.customId)
			await thread.setLocked(true); 
			let finalaval = aval / 3
			let finalaval2 = Math.round(finalaval)
			console.log("[NOTA} " + finalaval + "("  + finalaval2 + ")")
			let finalav = finalaval.toString()
			let embed = new MessageEmbed().setTitle("Nota do avaliador").setColor("ORANGE").setTimestamp().setDescription("Escreva abaixo sua sugestão ou seu feedback para o servidor! **Lembre de mencionar o usuário que atendeu seu pedido!**")
			let msg5 = await thread.send({content: `<@${interaction.member.user.id}>`, embeds:[embed]})
			const filter2 = collected => collected.author.id === interaction.member.user.id;
				   msg5.channel.awaitMessages({ filter: filter2, max: 1, time: 60000, errors: ['time'] })
				 .then(async collected =>  {
				   msg5.delete()
				   const response = collected.first().content
			let embed = new MessageEmbed().setTitle("Finalizado").setColor("GREEN").setTimestamp().setDescription("Obrigado! Abaixo está o resultado da avaliação (lembrando que os valores são arrendodados, então pode ser que eles não estejam totalmente corretos!)").addField("Avaliação", `${finalav.substring(0,4)} (${"⭐".repeat(finalaval2) + "<:2b50:998707684528361582>".repeat(5 - finalaval2)})`).addField("Nota do avaliador", response)
			let avembed = new MessageEmbed().setAuthor("Avaliação (Pedido) de " + interaction.member.user.tag, interaction.member.user.displayAvatarURL({dynamic: true})).setColor("RED").setTimestamp()
			.addField("Avaliação", `${finalav.substring(0,4)} (${"⭐".repeat(finalaval2) + "<:2b50:998707684528361582>".repeat(5 - finalaval2)})`)
			.addField("Nota do avaliador", response)
			thread.send({embeds:[embed]})
			interaction.guild.channels.cache.get("998380875144232980").send({embeds:[avembed]})
			db.add(`nota_${interaction.guild.id}`, aval / 3)
			db.add(`notas_${interaction.guild.id}`, 1)
			let totalnota = Number(db.fetch(`nota_${interaction.guild.id}`))
			let notas = db.fetch(`notas_${interaction.guild.id}`)
			let finaltopic = Math.round(totalnota / notas)
			let nota = totalnota / notas
			nota = nota.toString()
			nota = nota.substring(0,4)
			console.log(finaltopic)
			interaction.guild.channels.cache.get("998380875144232980").setTopic(`Nota total dos avaliadores: ${nota} (${"⭐".repeat(finaltopic) + "<:2b50:998707684528361582>".repeat(5 - finaltopic)})`)
			setTimeout(async function() {
				await thread.delete()
			}, 5000)
		 })

		})
		})
	})	  
		}
		if(i.values[0] == "cancelar") {
			thread.send("Cancelando...")
			thread.setLocked(true)
			setTimeout(async function() {
				await thread.delete()
			}, 3000)
		}
		})
  }
}