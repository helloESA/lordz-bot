const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
//const msgHandler = require('./msgHndlr')
const moment = require('moment-timezone')
const options = require('./options')

moment.tz.setDefault('Asia/Jakarta').locale('id')
const time = moment().format('MMMM Do YYYY, h:mm:ss a')
// Cache handler and check for file change
require('./msgHndlr')
nocache('./msgHndlr', module => console.log(`${time} '${module}' Updated!`))

const start = async (client = new Client()) => {
        console.log('[DEV]', color('Malz', 'yellow'))
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
            console.log('[Client State]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        // listening on message
        client.onMessage((async (message) => {
            client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 4000) {
                    client.cutMsgCache()
                }
            })
            msgHandler(client, message)
        }))

        client.onGlobalParicipantsChanged((async (heuh) => {
            await welcome(client, heuh)
            //left(client, heuh)
            }))
        
         client.onAddedToGroup((async (chat) => {
            // let totalMem = await chat.groupMetadata.participants.length
            // if (totalMem < 20) { 
            //     client.sendText(chat.id, `Yaampun member nya cuma ${totalMem}, Kalo mau invite bot, minimal jumlah mem ada 20 atau chat owner!`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
            // } else {
            //     client.sendText(chat.groupMetadata.id, `Halo warga grup *${chat.contact.name}* terimakasih sudah menginvite bot ini, untuk melihat menu silahkan kirim *!menu*`)
            // } 
            client.sendText(chat.id, `Berhubungan Server terbatas bot ini hanya untuk grup Private!\n\nJika ada pihak yang membutuhkan bot ini untuk digrup donasi MIN 10(tanpa request) ke 083159125945 (OVO) dan konfirmasi owner bot wa.me/6289673766582\n\nterima kasih.`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
        }))

        /*client.onAck((x => {
            const { from, to, ack } = x
            if (x !== 3) client.sendSeen(to)
        }))*/

        // listening on Incoming Call
        client.onIncomingCall(( async (call) => {
            await client.sendText(call.peerJid, 'Maaf, saya tidak bisa menerima panggilan. nelfon = block!')
            .then(() => client.contactBlock(call.peerJid))
        }))
    }

/**
 * uncache if there is file change
 * @param {string} module module name or path
 * @param {function} cb when module updated <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    require('fs').watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * uncache a module
 * @param {string} module module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}    

create('Ijmalan', options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))