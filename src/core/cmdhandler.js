const Main = require('../main')
const { CmdParser } = require('discordjs-cmds')
const Embeds = require('../util/embeds')
const Guildpres = require('../util/guildpres')


/*
    TYPES:

    ADMIN:          ADMIN
    GUILDADMIN:     GUILDADMIN
    MODERATION:     MODERATION
    FUN:            FUN
    SETTING:        SETTING
    CHAT:           CHAT
    MISC:           MISC

*/

class CmdHandler {
    constructor(client, prefix) {
        this.cmd = new CmdParser(client, prefix)

        this.cmd.addType('DEBUG')

        this.cmd.setOptions({
            guildownerperm: 5,
        })

        this.cmd.setHost(Main.config.hostid)

        Guildpres.get(dbpres => this.cmd.setGuildPres(dbpres))

        this.cmd   
            .register(
                require('../commands/autochannel').ex,
                'autochannel',
                ['autochan', 'ac', 'autochans'],
                'Manage automatic voice channels',
                `\`${prefix}autochannel set <channel>\n` +
                `\`${prefix}autochannel unset <channel>\n` +
                `\`${prefix}autochannel create <list>\n`,
                this.cmd.type.GUILDADMIN,
                3
            )
            .register(
                require('../commands/broadcast').ex,
                'broadcast',
                ['bcast', 'bc'],
                'Send messages to all servers or server owners',
                `\`${prefix}broadcast owners <msg>\n` +
                `\`${prefix}broadcast all <msg>\n`,
                this.cmd.type.ADMIN,
                999
            )
            .register(
                require('../commands/id').ex,
                'id',
                ['whois', 'whatis', 'identify'],
                'Get elements by ID or IDs of elements',
                `\`${prefix}id <ID>\n` +
                `\`${prefix}id <name>\n`,
                this.cmd.type.MISC,
                0
            )
            .register(
                require('../commands/restart').ex,
                'restart',
                [],
                'Restart the bot',
                `\`${prefix}restart\n`,
                this.cmd.type.ADMIN,
                100
            )
            .register(
                require('../commands/mvall').ex,
                'mvall',
                ['moveall', 'mv'],
                'Move all members in current channel to another',
                `\`${prefix}mvall <channel>\`\n`,
                this.cmd.type.MODERATION,
                2
            )
            .register(
                require('../commands/guild').ex,
                'guild',
                ['guildstats', 'server'],
                'Get information about guild',
                `\`${prefix}guild\`\n`,
                this.cmd.type.MISC,
                0
            )
            .register(
                require('../commands/vote').ex,
                'vote',
                ['poll'],
                'Create a vote',
                null,
                this.cmd.type.CHAT,
                0
            )
            .register(
                require('../commands/quote').ex,
                'quote',
                ['q'],
                'Quote a message of any channel in the guild',
                `\`${prefix}user <messageID>\`\n`,
                this.cmd.type.CHAT,
                0
            )
            .register(
                require('../commands/user').ex,
                'user',
                ['member', 'userinfo', 'uinfo', 'profile'],
                'Get information about user on guild',
                `\`${prefix}user <user>\`\n` + 
                `\`${prefix}user\`\n`,
                this.cmd.type.MISC,
                0
            )
            // AUTOROLE COMMAND
            .register(
                require('../commands/autorole').ex,
                'autorole',
                ['guildrole', 'joinrole'],
                'Set the role users will automatically get after joining the guild',
                `\`${prefix}autorole <role>\`\n` + 
                `\`${prefix}autorole reset\`\n`,
                this.cmd.type.GUILDADMIN,
                5
            )
            // INFO COMMAND
            .register(
                require('../commands/info').ex, 
                'info', 
                ['about'], 
                'Get info about the bot', 
                `\`${prefix}info\``, 
                this.cmd.type.MISC
            )
            // TEST COMMAND
            .register(
                require('../commands/test').ex, 
                'test', 
                [], 
                'Just for testing purposes', 
                null, 
                'DEBUG',
                999
            )
            // PERMS COMMAND
            .register(
                require('../commands/perms').ex,
                'perms',
                ['permroles', 'perm', 'permlvl'],
                'Set the permission levels for specific roles',
                `\`${prefix}perms <LVL>, <role1>, <role2>, ...\`\n` + 
                `\`${prefix}perms list\`\n` +
                `\`${prefix}perms reset <lvl>\``,
                this.cmd.type.SETTING,
                5
            )
            // GAME COMMAND
            .register(
                require('../commands/game').ex, 
                'game', 
                ['playing', 'botmsg'], 
                'Set messages the bot should show in playing text', 
                `\`${prefix}game msg <message 1>, <message 2>, ...\`\n` +
                `\`${prefix}game type <playing, streaming, listening, watching>\`\n` +
                `\`${prefix}game url <twitch url>\`\n` +
                `\`${prefix}game reset\``,
                this.cmd.type.SETTING,
                999
            )
            // SAY COMMAND
            .register(
                require('../commands/say').ex,
                'say',
                ['saymsg'],
                'Send an embed message with the bot',
                `\`${prefix}say <message>\`\n` +
                `\`${prefix}say -e <message>\`\n` +
                `\`${prefix}say -e:<color> <message>\`\n` +
                `\`${prefix}say colors\`\n`,
                this.cmd.type.CHAT,
                2
            )
            // EVAL COMMAND
            .register(
                require('../commands/eval').ex,
                'eval',
                ['evaluate', 'exec'],
                'evaluate code with this command',
                `\`${prefix}eval <js code>\`\n` +
                `\`${prefix}eval objects\`\n`,
                this.cmd.type.ADMIN,
                999
            )
            // PREFIX COMMAND
            .register(
                require('../commands/prefix').ex,
                'prefix',
                ['pre', 'guildpre', 'guildprefix'],
                'Register a guild specific prefix',
                `\`${prefix}prefix <new prefix>\`\n` +
                `\`${prefix}prefix\`\n`,
                this.cmd.type.GUILDADMIN,
                5
            )
            // CLEAR COMMAND
            .register(
                require('../commands/clear').ex,
                'clear',
                ['purge', 'clean'],
                'Clear an ammount of messages in a chat',
                `\`${prefix}clear <ammount>\`\n` +
                `\`${prefix}clear <ammount> <user>\`\n` +
                `\`${prefix}prefix\`\n`,
                this.cmd.type.MODERATION,
                4
            )

        this.cmd.event.on('commandFailed', (type, msg, err) => 
            console.log(type, err)
        )
        this.cmd.event.on('commandFailed', (type, msg, err) => 
            Embeds.error(msg.channel, `Error Type: *\`${type}\`*\n\nError:\n\`\`\`\n${err}\n\`\`\``, "COMMAND ERROR")
        )

        return this.cmd
    }
}

exports.CmdHandler = CmdHandler