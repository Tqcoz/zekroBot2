const Main = require('../main')
const client = Main.client
const Mysql = Main.mysql
const Embeds = require('../util/embeds')
const Discord = require('discord.js')
const util = require('util');


function parse(chan, memb) {

    function _ornull(value, replacer) {
        return value ? value : (replacer ? replacer : '<n/a>')
    }

    let maxrole = memb.highestRole
    let user = memb.user

    let permlvl = Main.cmd.getPermLvl(memb)

    let emb = new Discord.RichEmbed()
        .setTitle(memb.displayName + ' - User Info')
        .addField('User Tag', user.tag)
        .addField('Display Name', memb.displayName)
        .addField('ID', `\`\`\`${user.id}\`\`\``)
        .addField('Current Game', memb.presence.game ? memb.presence.game : 'Not in game')
        .addField('Current Status', memb.presence.status)
        .addField('Joined Guild At', _ornull(memb.joinedAt))
        .addField('Created Account At', _ornull(user.createdAt))
        .addField('Permission Level', _ornull(permlvl, '0'))
        .addField('Roles', memb.roles.array().slice(1).map(r => `<@&${r.id}>`).join(', '))
        .addField('User Level', '*Comming soon*')
        .addField('Recent Reports', '*Comming soon*')
    
    if (maxrole && maxrole.color)
        emb.setColor(maxrole.color)

    if (user.avatarURL)
        emb.setThumbnail(user.avatarURL)

    chan.send('', emb)
}



exports.ex = (msg, args) => {

    let guild = msg.member.guild
    let chan = msg.channel

    if (args.length < 1) {
        parse(chan, msg.member)
        return
    }

    let memb = guild.members.find(m => m.id == args[0].replace(/[<@!>]/g, ''))
    if (!memb)
        memb = guild.members.find(
            m => m.displayName.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1 ||
                 m.user.username.toLowerCase().indexOf(args.join(' ').toLowerCase()) > -1
        )
    if (!memb)
        Embeds.error(chan, `Could not fetch any member to the input \`\`\`${args.join(' ')}\`\`\``, 'INVALID INPUT')
    else
        parse(chan, memb)
}