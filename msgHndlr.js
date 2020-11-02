const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const fetch = require('node-fetch')
const download = require('download-file')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const color = require('./lib/color')
const { spawn, exec } = require('child_process')
const muted = JSON.parse(fs.readFileSync('./lib/muted.json'))
const vip = JSON.parse(fs.readFileSync('./lib/vip.json'))
/*const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')*/
const { liriklagu, quotemaker, tulis, ig, fb, twt, sleep, jadwalTv, ss } = require('./lib/functions')
const { help, snk, info, donate, readme, listChannel, tts_list, theme_meme } = require('./lib/help')
const { stdout } = require('process')
const nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')
const { BikinTikel } = require('./lib/bikin_tikel')
const { customs } = require('./lib/mememaker')
const { uploadImages } = require('./lib/fetcher')
const translate = require('@vitalets/google-translate-api');
const setting = JSON.parse(fs.readFileSync('./lib/config.json'))
const banned = JSON.parse(fs.readFileSync('./lib/banned.json'));
const limit = JSON.parse(fs.readFileSync('./lib/limit.json'));
const msgLimit = JSON.parse(fs.readFileSync('./lib/msgLimit.json'));
const {prefix, banChats, restartState: isRestart,mtc: mtcState, whitelist ,sAdmin, limitCount, memberLimit, groupLimit} = setting

moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const msgs = (message) => {
            if (command.startsWith('#')) {
                if (message.length >= 10){
                    //return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: '[ WAIT ] Sedang di proses⏳ silahkan tunggu sebentar',
            error: {
                St: '[❗] Kirim gambar dengan caption *#sticker* atau tag gambar yang sudah dikirim',
                Qm: '[❗] Terjadi kesalahan, mungkin themenya tidak tersedia!',
                Yt3: '[❗] Terjadi kesalahan, tidak dapat meng konversi ke mp3!',
                Yt4: '[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] Terjadi kesalahan, mungkin karena akunnya private',
                Ki: '[❗] Bot tidak bisa mengeluarkan admin group!',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!'
            }
        }

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const serial = sender.id
        const isSadmin = serial === sAdmin
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = '6289673766582@c.us'
        const isLordzOwner = 'LordZ' 
        const isOOwner = sender.pushname === isLordzOwner
        const isOwner = sender.id === ownerNumber
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('#')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('#')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        if (!isGroupMsg && !command.startsWith('#')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        if (isGroupMsg && !command.startsWith('#')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        //if (!isOwner) return
        const isMuted = (chatId) => {
            if(muted.includes(chatId)){
                return false
            }else{
                return true
            }
        }

        const isVIP = (chet) => {
            if(vip.includes(chet)){
                return false
            }else{
                return true
            }
        }

        function restartAwal(client){
            setting.restartState = false
            isRestart = false
            client.sendText(setting.restartId, 'Restart Succesfull!')
            setting.restartId = 'undefined'
            fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null,2));
        }

        //BEGIN HELPER


        if (typeof Array.prototype.splice === 'undefined') {
            Array.prototype.splice = function (index, howmany, elemes) {
                howmany = typeof howmany === 'undefined' || this.length;
                var elems = Array.prototype.slice.call(arguments, 2), newArr = this.slice(0, index), last = this.slice(index + howmany);
                newArr = newArr.concat.apply(newArr, elems);
                newArr = newArr.concat.apply(newArr, last);
                return newArr;
            }
        }

        function isMsgLimit(id){
            if (isSadmin) {return false;}
            let found = false;
            const addmsg = JSON.parse(fs.readFileSync('./lib/msgLimit.json'))
            for (let i of addmsg){
                if(i.id === id){
                    if (i.msg >= 12) {
                        found === true 
                        console.log(i)
                        client.reply(from, '*[ANTI-SPAM]*\nMaaf, akun anda kami blok karena SPAM, dan tidak bisa di UNBLOK!', id)
                        client.contactBlock(id)
                        banned.push(id)
                        fs.writeFileSync('./lib/banned.json', JSON.stringify(banned))
                        return true;
                    }else if(i.msg >= 7){
                        found === true
                        client.reply(from, '*[ANTI-SPAM]*\nNomor anda terdeteksi spam!\nMohon tidak spam 5 pesan lagi atau nomor anda AUTO BLOK!', id)
                        return true
                    }else{
                        found === true
                        return false;
                    }   
                }
            }
            if (found === false){
                let obj = {id: `${id}`, msg:1};
                addmsg.push(obj);
                fs.writeFileSync('./lib/msgLimit.json',JSON.stringify(addmsg));
                return false;
            }  
        }

        function addMsgLimit(id){
            if (isSadmin) {return;}
            var found = false
            const addmsg = JSON.parse(fs.readFileSync('./lib/msgLimit.json'))
            Object.keys(addmsg).forEach((i) => {
                if(addmsg[i].id == id){
                    found = i
                    console.log(addmsg[0])
                }
            })
            if (found !== false) {
                addmsg[found].msg += 1;
                fs.writeFileSync('./lib/msgLimit.json',JSON.stringify(addmsg));
                console.log(addmsg[0])
            }
        }

        function isLimit(id){
            if (isSadmin) {return false;}
            let found = false;
            for (let i of limit){
                if(i.id === id){
                    let limits = i.limit;
                    if (limits >= limitCount) {
                        found = true;
                        console.log(`Limit Abis : ${serial}`)
                        return true;
                    }else{
                        limit
                        found = true;
                        return false;
                    }
                    }
            }
            if (found === false){
                let obj = {id: `${id}`, limit:1};
                limit.push(obj);
                fs.writeFileSync('./lib/limit.json',JSON.stringify(limit));
                return false;
            }  
        }

        function limitAdd (id) {
            if (isSadmin) {return;}
            var found = false;
            const limidat = JSON.parse(fs.readFileSync('./lib/limit.json'))
            Object.keys(limidat).forEach((i) => {
                if(limidat[i].id == id){
                    found = i
                    console.log(limidat[i])
                }
            })
            if (found !== false) {
                limidat[found].limit += 1;
                console.log(limidat[found])
                fs.writeFileSync('./lib/limit.json',JSON.stringify(limidat));
            }
        }
        //END HELPER        

        if (body === '#unmute') {
            if(isGroupMsg) {
                if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
                    let index = muted.indexOf(chat.id);
                    muted.splice(index,1)
                    fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                    client.reply(from, `Bot telah di unmute!`, id)         
            }
        }
        if (!isMuted(chat.id) == true) return console.log(`Muted ${chat.id} ${name}`)

        switch(command) {
        case '#limit':
            var found = false
            const limidat = JSON.parse(fs.readFileSync('./lib/limit.json'))
            for(let lmt of limidat){
                if(lmt.id === serial){
                    let limitCounts = limitCount-lmt.limit
                    if(limitCounts <= 0) return client.reply(from, `Limit request anda sudah habis\n\n_Note : Limit akan direset setiap jam 21:00!_`, id)
                    client.reply(from, `Sisa limit request anda tersisa : *${limitCounts}*\n\n_Note : Limit akan direset setiap jam 21:00!_`, id)
                    found = true
                }
            }
            console.log(limit)
            console.log(limidat)
            if (found === false){
                let obj = {id: `${serial}`, limit:1};
                limit.push(obj);
                fs.writeFileSync('./lib/limit.json',JSON.stringify(limit, 1));
                client.reply(from, `Sisa limit request anda tersisa : *${limitCount}*\n\n_Note : Limit akan direset setiap jam 21:00!_`, id)
            }
            break
        case '#cobalimit':
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            break            
        case '#restartlimit':
        case '#restart':
        case '#reset':
            if (!isOwner) return client.reply(from, `_Hanya Owner Bot Yang Bisa Mereset Limit!_`, id)
            client.reply(from, '⚠️ *[INFO]* Reseting ...', id)
            setting.restartState = true
            setting.restartId = chat.id
            fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2));
            fs.writeFileSync('./lib/limit.json', JSON.stringify(limit));
            //fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null,2));
            fs.writeFileSync('./lib/msgLimit.json', JSON.stringify(msgLimit));
            //fs.writeFileSync('./lib/banned.json', JSON.stringify(banned));
            await sleep(5000).then(() => client.reply(from, `✅ _Reset limit Completed!_`, id))

            break            
        case '#memecustom':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)             
            arg = body.trim().split('.')
            if ((isMedia || isQuotedImage) && arg.length >= 3) {
                const top = arg[1]
                const bottom = arg[2]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await customs(getUrl, top, bottom)
                client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then((serialized) => console.log(`Done`))
                    .catch((err) => console.error(err))
            } else {
                await client.reply(from, 'Tag Gambar! ', id)
            }
            break            
        case '#simi' :
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)            
            const simi = body.slice(7)
            const sim = await get.get( 'https://api.i-tech.id/tools/simi?key=ZEL5ZL-Wm5Psl-66gG9x-W3FHEa-97bm8g&kata='+simi).json()
            client.reply(from, sim.result, id)
            break
        case '#timeline':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)            
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)            
            const taimlen = await get.get('https://api.i-tech.id/tools/gambar?key=ZEL5ZL-Wm5Psl-66gG9x-W3FHEa-97bm8g').json()                                 
            await client.sendFileFromUrl(from, taimlen.result , 'temlen.jpg',`_Timeline buat ${pushname}.._`, id)
            break
        case '#unmute':
            console.log(`Unmuted ${name}!`)
            break
        case '#mute':
            if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
            muted.push(chat.id)
            fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
            client.reply(from, `Bot telah di mute pada chat ini! *#unmute* untuk membuka mute!`, id)
            break              
        case '#stikernobg':
        case '#stickernobg':
           // if (args.length === 1 && !isMedia || args.length === 1 && !quotedMsg) return client.reply(from, `Kirim foto dengan caption *!stickernobg*`, id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)            
            if (isMedia && type === 'image') {
              try {
                var mediaData = await decryptMedia(message, uaOverride)
                var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                var base64img = imageBase64
                var outFile = './media/img/noBg.png'
                var result = await removeBackgroundFromImageBase64({ base64img, apiKey: 'VvkVdYiGLthNVyFYwx1yp73H', size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                } catch(err) {
                    console.log(err)
                    client.reply(from, `Maaf, Tidak dapat mengidentifikasi background! mungkin terlalu banyak warna.`, id)
                }
                
            } else if (quotedMsg && quotedMsg.type == 'image') {
                client.reply(from, `Maaf, media tidak terdeteksi! Kirim foto dengan caption *#stickernobg* bukan tag`, id) 
            } else {
                client.reply(from, `Kirim foto dengan caption *#stickernobg*`, id)
            }
            break            
        case '#sticker':
        case '#stiker':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)            
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 2) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await client.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Caught exception: ', err))
                } else {
                    client.reply(from, mess.error.Iv, id)
                }
            } else {
                    client.reply(from, mess.error.St, id)
            }
            break
        case '#stimage':
        case '#sti':
            if (args.length === 2) return client.reply(from, `Hai ${pushname} untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *#ttimage*`, id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (quotedMsg) {
                client.reply(from, '_Mohon tunggu sedang mengkonversi stiker..._', id)
                if( quotedMsg.type === 'sticker') {
                //getStickerDecryptable is an insiders feature! 
                    //let stickerDecryptable = await client.getStickerDecryptable(quotedMsg.id)
                    //if(stickerDecryptable) mediaData = await decryptMedia(stickerDecryptable, uaOverride)
                   // await client.sendImage(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, `${pushname}.jpg`, `Sticker berhasil dikonversi! ${pushname}`)
                   //    } else {
                        mediaData = await decryptMedia(quotedMsg, uaOverride)
                        await client.sendImage(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, `${pushname}.jpg`, `Sticker berhasil dikonversi! ${pushname}`)
                   //  
                   } else {
                        client.reply(from, `Hai ${pushname} sepertinya yang ada tag bukan stiker, untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *#stimage*`, id)
                   }
                } else {
                    client.reply(from, `Hai ${pushname} untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *#stimage*`, id)
                }
            break
        case '#ttsticker':
        case '#ttstiker':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            const texk = body.slice(10)
            client.reply(from, '_Sedang mengkonversi teks..._', id)
            try {
                if (quotedMsgObj == null) {
                    const GetData = await BikinTikel(texk)
                    if (GetData.status == false) return client.reply(from, 'Kesalahan dalam mengkonversi teks! tag tulisan atau gunakan teks setelah perintah *#ttsticker [teks]*', id)
                    try {
                        await client.sendImageAsSticker(from, GetData.base64)
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    const GetData = await BikinTikel(quotedMsgObj.body)
                    if (GetData.status == false) return client.reply(from, 'Kesalahan dalam mengkonversi teks! tag tulisan atau gunakan teks setelah perintah *#ttsticker [teks]*', id)
                    try {
                        await client.sendImageAsSticker(from, GetData.base64)
                    } catch (err) {
                        console.log(err)
                    }
                }
            } catch (err){
                console.log(err)
            }
            break;                        
        case '#stickergif':
        case '#stikergif':
        case '#sgif':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, `_Mohon tunggu.. sedang diproses ⏳_`, id)
                        const filename = `./media/aswu.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gifify ${filename} -o ./media/output.gif --fps=30 --resize=240:240`, async function (error, stdout, stderr) {
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                    })
                } else (
                    client.reply(from, `_Gagal mengkonversi sticker gif⚠️_`, id)
                )
            }
            break                       
        case '#donasi':
        case '#donate':
            client.sendLinkWithAutoPreview(from, 'https://github.com/ijmalan', donate)
            break
        case '#tts':
        if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6285559038021 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            try {
                if (args.length === 1) return client.reply(from, 'Kirim perintah *#tts [code_bahasa] [teks]*, contoh *#tts id halo semua*')
                var dataBhs = args[1]      
                const ttsMlz = require('node-gtts')(dataBhs)
                var dataText = body.slice(8)
                if (dataText === '') return client.reply(from, 'Masukkan teksnya', id)
               // if (dataText.length > 500) return client.reply(from, 'Teks terlalu panjang!', id)
                var dataBhs = body.slice(5, 7)
                ttsMlz.save('./media/tts/tts.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/tts.mp3', id)
                })
            } catch (err){
                console.log(err)
                client.reply(from, tts_list, id)
            }
            break
        case '#nulis':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#nulis [teks]*', id)
            const nulis = encodeURIComponent(body.slice(7))
            client.reply(from, `_Bot lagi menulis ni ${pushname}..._`, id)
            let urlnulis = `https://mhankbarbar.herokuapp.com/nulis?text=${nulis}&apiKey=IsDssiTLL9hE7ofCV1Ot`
            await fetch(urlnulis, {method: "GET"})
            .then(res => res.json())
            .then(async (json) => {
                await client.sendFileFromUrl(from, json.result, 'Nulis.jpg', `Udah Nih ${pushname}❤`, id)
            }).catch(e => client.reply(from, "Error: "+ e));
            break           
        case '#ytmp3':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#ytmp3 [linkYt]*, untuk contoh silahkan kirim perintah *#readme*')
            let isLinksss = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLinksss) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const respp = await get.get(`https://mhankbarbar.herokuapp.com/api/yta?url=${args[1]}&apiKey=IsDssiTLL9hE7ofCV1Ot`).json()
                if (respp.error) {
                    client.reply(from, respp.error, id)
                } else {
                    const { title, thumb, filesize, result } = await respp
                    if (Number(filesize.split(' MB')[0]) >= 30.00) return client.reply(from, 'Maaf durasi video sudah melebihi batas maksimal!', id)
                    client.sendFileFromUrl(from, thumb, 'thumb.jpg', `➸ *Title* : ${title}\n➸ *Filesize* : ${filesize}\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit.`, id)
                    await client.sendFileFromUrl(from, result, `${title}.mp3`, '', id).catch(() => client.reply(from, mess.error.Yt3, id))
                    //await client.sendAudio(from, result, id)
                }
            } catch (err) {
                client.sendText(ownerNumber[0], 'Error ytmp3 : '+ err)
                client.reply(from, mess.error.Yt3, id)
            }
            break   
        case '#ytmp4':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#ytmp4* _linkYt_, untuk contoh silahkan kirim perintah *#readme*', id)
            let isLinks2 = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLinks2) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const ytvvv = await get.get(`https://mhankbarbar.herokuapp.com/api/ytv?url=${args[1]}&apiKey=IsDssiTLL9hE7ofCV1Ot`).json()
                if (ytvvv.error) {
                    client.reply(from, ytvvv.error, id)
                } else {
                    if (Number(ytvvv.filesize.split(' MB')[0]) > 40.00) return client.reply(from, 'Maaf durasi video sudah melebihi batas maksimal!', id)
                    client.sendFileFromUrl(from, ytvvv.thumb, 'thumb.jpg', `➸ *Title* : ${ytvvv.title}\n➸ *Filesize* : ${ytvvv.filesize}\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit.`, id)
                    await client.sendFileFromUrl(from, ytvvv.result, `${ytvvv.title}.mp4`, '', id).catch(() => client.reply(from, mess.error.Yt4, id))
                }
            } catch (er) {
                client.sendText(ownerNumber[0], 'Error ytmp4 : '+ er)
                client.reply(from, mess.error.Yt4, id)
            }
            break       
            case '#nyanyi':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#nyanyi _Lagunya_*, untuk contoh silahkan kirim perintah *#readme*')
            const quernyanyi = body.slice(8)
            try {
                client.reply(from, mess.wait, id)
                const bahannyanyi = await fetch(`https://api.vhtear.com/music?query=${quernyanyi}&apikey=botnolepbydandyproject`)
                if (!bahannyanyi) throw new Error(`Err nyanyi :( ${bahannyanyi.statusText}`)
                const datanyanyi = await bahannyanyi.json()
                console.log(datanyanyi)
                client.reply(from, `_Bot sedang vn..._`)
                if (!datanyanyi.result[0].judul == '') {
                    client.sendFileFromUrl(from, datanyanyi.result[0].linkImg, 'Thumbnyanyi.jpg',`Bot nyanyi lagu : ${datanyanyi.result[0].judul}\nDari penyanyi : ${datanyanyi.result[0].penyanyi}\nDurasinya : ${datanyanyi.result[0].duration}`)
                    // const url = datanyanyi.result[0].linkMp3
                    // const options = {
                    //     directory: "./media/nyanyi",
                    //     filename: "botnyanyi.mp3"
                    // }
                    // download(url, options, function(err, resp, body){
                    //     if (err) return console.log(err)
                    //     if (resp) { 
                    //         console.log('Berhasil didownload ke : '+resp)
                    //         //client.sendFile(from, resp, 'tes.jpg', 'Donekan? saya bot pamit. canda wkwk', id)
                    //         }
                    //     if (body) return console.log(body,'HIH')
                    // })
                    await client.sendFileFromUrl(from, datanyanyi.result[0].linkMp3, 'Laginyanyi.mp3', '', id).catch((errs) => console.log(errs))
                } else {
                    client.reply(from, `_Kayanya bot gabisa nyanyi lagu itu :(_`, id)
                }
            } catch (err) {
                console.log(err)
                client.reply(from, `_Kayanya bot gabisa nyanyi lagu itu hemm :(_`, id)
            }
            break        
        case '#translate':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, `Penggunaan untuk translate teks\n\nPenggunaan 1 : *#translate [data bahasa] [teks yang akan ditranslate]* _(tanpa tag)_\nPenggunaan 2 : *#translate [data bahasa]* _(dengan tag)_\n\nContoh 1 : *#translate id hello how are you* _(tanpa tag)_\nContoh 2 : *#translate id* _(tag pesan yang akan ditranslate)_`, id)
            //if (!quotedMsg) return client.reply(from, 'Tag pesan yang akan ditranslate!', id)
            if (quotedMsg) {
                const dataTextReal = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
                const lang = args[1].toString()
                    const trans = async (dataText, lang) => {
                    console.log(`Translate text to ${lang}...`)
                    const result = await translate(dataTextReal, {
                        to: lang
                        })
                      .then((res) => client.reply(from, res.text, id))
                      .catch((err) => client.reply(from, `Sepertinya tidak ada data bahasa ${lang}\n\n${tts_list}`, id))
                    // console.log(result.data[0])
                }
                trans(dataTextReal, lang) 
            } else if (args.length >= 2) {
                // !translate id 
                const dataTextManu = body.slice(13)
                const lang = args[1].toString()
                    const trans = async (dataText, lang) => {
                    console.log(`Translate text to ${lang}...`)
                    const result = await translate(dataTextManu, {
                        to: lang
                        })
                      .then((res) => client.reply(from, res.text, id))
                      .catch((err) => client.reply(from, `Sepertinya tidak ada data bahasa ${lang}\n\n${tts_list}`, id))
                    // console.log(result.data[0])
                }
                trans(dataTextManu, lang)
            } else {
                client.reply(from, `Kesalahan mentranslate`, id)
            }
            break
        case '#cuaca':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#cuaca [tempat]*\nContoh : *#cuaca tangerang', id)
            const tempat = body.slice(7)
            client.reply(`_Sedang mencari data Cuaca ${tempat}...._`)
            const weather = await get.get(`https://mhankbarbar.herokuapp.com/api/cuaca?q=${tempat}&apiKey=IsDssiTLL9hE7ofCV1Ot`).json()
            if (weather.error) {
                client.reply(from, weather.error, id)
            } else {
                client.reply(from, `➸ Tempat : ${weather.result.tempat}\n\n➸ Angin : ${weather.result.angin}\n➸ Cuaca : ${weather.result.cuaca}\n➸ Deskripsi : ${weather.result.desk}\n➸ Kelembapan : ${weather.result.kelembapan}\n➸ Suhu : ${weather.result.suhu}\n➸ Udara : ${weather.result.udara}`, id)
            }
            break
        case '#fb':
        if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)        
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            try {
                if (args.length === 1) return client.reply(from, 'Kirim perintah *#fb [linkFb]* untuk contoh silahkan kirim perintah *#readme*', id)
                if (!args[1].includes('facebook.com')) return client.reply(from, mess.error.Iv, id)
                linkefbeh = args[1].toString()
                client.reply(from, mess.wait, id)
                const epbe = await fb(args[1])
                client.sendFileFromUrl(from, epbe.url, `Cuih${epbe.exts}`, epbe.capt, id)
            } catch (err) {
                console.log(err)
            }
            break
        case '#twt':
        if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            try {
                if (args.length === 1) return client.reply(from, 'Kirim perintah *#twt* _linkVideoTwitter_ untuk contoh silahkan kirim perintah *#readme*', id)
                if (!args[1].includes('twitter.com')) return client.reply(from, mess.error.Iv, id)
                linktwit = args[1].toString()
                client.reply(from, mess.wait, id)
                const twit = await twt(args[1])
                //client.sendLinkWithAutoPreview(from, twit.link, twit.capt)
                client.sendFileFromUrl(from, twit.url, `Twtny${twit.exts}`, twit.capt, id)
            } catch (err) {
                //client.reply(from, `Kesalahan dengan kode error : ${err}`)
                console.log(err)
            }
            break 
        case '#wiki':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/62896737665821 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#wiki* _Kata Kunci_\nContoh : **#wiki* _asu_ ', id)
            const query_ = body.slice(6)
            const wiki = await get.get(`https://api.vhtear.com/wikipedia?query=${encodeURIComponent(query_)}&apikey=botnolepbydandyproject`).json()
            if (wiki.error) {
                client.reply(from, wiki.error, id)
            } else {
                client.reply(from, '_Sedang mencari data..._', id)
                console.log(wiki)
                //client.reply(from, `_Mohon tunggu sedang mencari data.._`, id)
                //client.reply(from, `➣ *Query* : ${query_}\n\n➣ *Result* : ${wiki.result}`, id)
                client.sendFileFromUrl(from, wiki.result.ImgResult[0], wiki.jpg, `*Hasil wikipedia dari ${query_}*\n\n${wiki.result.Info}`, id).catch(() => client.reply(from, `*Hasil wikipedia dari ${query_}*\n\n${wiki.result.Info}`, id))
                //console.log(wiki.result.ImgResult[0],wiki.result.Info)
            }
            break                       
        /*case '#creator':
            client.sendContact(from, '6285892766102@c.us')
            break*/
        case '#ig':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            try {
                if (args.length === 1) return client.reply(from, 'Kirim perintah *#ig [linkIg]* untuk contoh silahkan kirim perintah *#readme*', id)
                if (!args[1].includes('instagram.com')) return client.reply(from, mess.error.Iv, id)
                linkinsta = args[1].toString()
                client.reply(from, mess.wait, id)
                const igee = await ig(args[1])
                client.sendFileFromUrl(from, igee.url, `Ignyakk${igee.exts}`, igee.capt, id)
            } catch (err) {
                //client.reply(from, `Kesalahan dengan kode error : ${err}`)
                console.log(err)
            }
            break
        case '#family100':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            const family = await get.get('https://api.vhtear.com/family100&apikey=botnolepbydandyproject').json()
            client.reply(from, `*FAMILY 100*\n\n*Pertanyaan* : ${family.result.soal}\n\n_Waktu : 30 Detik..._`, id)
            await sleep(10000)
            client.sendText(from, `_Sisa Waktu : 20 Detik_`)
            await sleep(10000)
            client.sendText(from, `_Sisa Waktu : 10 Detik_`)
            await sleep(10000)
            client.sendText(from, `_Waktu Habis..._`, id)
            await sleep(1000)
            client.reply(from, `*Jawaban* : ${family.result.jawaban}`, id)            
            break
        case '#caklontong':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            const cakl = await get.get('https://api.vhtear.com/funkuis&apikey=botnolepbydandyproject').json()
            client.reply(from,`*TTS CAK LONTONG*\n\n*Pertanyaan* : ${cakl.result.soal} \n\n_Waktu : 30 Detik..._`, id)
            await sleep(10000)
            client.sendText(from, `_Sisa Waktu : 20 Detik_`)
            await sleep(10000)
            client.sendText(from, `_Sisa Waktu : 10 Detik_`)
            await sleep(10000)
            client.sendText(from, `_Waktu Habis..._`, id)
            await sleep(1000)
            client.reply(from, cakl.result.desk, id) 
            break 
        case '#tebakgambar':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)            
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            const teabaks = await get.get('https://api.vhtear.com/tebakgambar&apikey=botnolepbydandyproject').json()                      
            const { soalImg, jawaban } = teabaks.result           
            await client.sendFileFromUrl(from, soalImg, 'soal.jpg',`*TEBAK GAMBAR*\n\n_Waktu : 30 Detik..._`, id) 
            await sleep(10000)
            client.sendText(from, `_Sisa Waktu : 20 Detik_`)
            await sleep(10000)
            client.sendText(from, `_Sisa Waktu : 10 Detik_`)
            await sleep(10000)
            client.sendText(from, `_Waktu Habis..._`, id)
            await sleep(1000)
            client.reply(from, `*Jawaban* : ${teabaks.result.jawaban}`, id)      
            break
       /* case '!nsfw':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                nsfw_.push(chat.id)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, 'NSWF Command berhasil di aktifkan di group ini! kirim perintah *!nsfwMenu* untuk mengetahui menu', id)
            } else if (args[1].toLowerCase() === 'disable') {
                nsfw_.splice(chat.id, 1)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, 'NSFW Command berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break*/
        case '#welcome':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                welkom.push(chat.id)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                welkom.splice(chat.id, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break
        /*case '!nsfwmenu':
            if (!isNsfw) return
            client.reply(from, '1. !randomHentai\n2. !randomNsfwNeko', id)
            break*/
        case '#igstalk':   
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1)  return client.reply(from, 'Kirim perintah *#igStalk @username*\nContoh *#igStalk @ijmalan*', id)
            client.reply(from, `_Sedang mencari data profil..._`, id)
            const stalk = await get.get(`https://api.vhtear.com/igprofile?query=${args[1]}&apikey=botnolepbydandyproject`).json()
            if (stalk.error) return client.reply(from, stalk.error, id)
            const { biography, follower, follow, post_count, full_name, username, picture, is_private } = stalk.result
            const caps = `➸ *Nama* : ${full_name}\n➸ *Username* : ${username}\n➸ *Jumlah Followers* : ${follower}\n➸ *Jumlah Following* : ${follow}\n➸ *Jumlah Postingan* : ${post_count}\n➸ *Biodata* : ${biography}`
            await client.sendFileFromUrl(from, picture, 'Profile.jpg', caps, id)
            break
        case '#ytsearch':
        case '#searchyt':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/628967376682 untuk pertanyaan lebih lanjut', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#searchyt* _Channel/Title YT yang akan dicari_')
            const keywot = body.slice(10)
            try {
                client.reply(from, '_Sedang mencari data..._')
                const response2 = await fetch(`https://api.vhtear.com/youtube?query=${encodeURIComponent(keywot)}&apikey=botnolepbydandyproject`)
                if (!response2.ok) throw new Error(`unexpected response ${response2.statusText}`)
                const jsonserc = await response2.json()
                const { result } = await jsonserc
                let xixixi = `*Hasil pencarian dari ${keywot}*\n`
                for (let i = 0; i < result.length; i++) {
                    xixixi += `\n*Title* : ${result[i].title}\n*Channel* : ${result[i].channel}\n*URL* : ${result[i].urlyt}\n*Durasi* : ${result[i].duration}\n*Views* : ${result[i].views}\n`
                }
                await client.sendFileFromUrl(from, result[0].image, 'thumbserc.jpg', xixixi, id)
            } catch (err) {
                    console.log(err)
            }
            break            
        /*case '#infogempa':
            const bmkg = await get.get('https://mhankbarbar.herokuapp.com/api/infogempa').json()
            const { potensi, koordinat, lokasi, kedalaman, magnitude, waktu, map } = bmkg
            const hasil = `*${waktu}*\n📍 *Lokasi* : *${lokasi}*\n〽️ *Kedalaman* : *${kedalaman}*\n💢 *Magnitude* : *${magnitude}*\n🔘 *Potensi* : *${potensi}*\n📍 *Koordinat* : *${koordinat}*`
            client.sendFileFromUrl(from, map, 'shakemap.jpg', hasil, id)
            break
        case '#anime':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#anime [query]*\nContoh : *#anime darling in the franxx*', id)
            const animek = await get.get('https://mhankbarbar.herokuapp.com/api/dewabatch?q=' + body.slice(7)).json()
            if (animek.error) return client.reply(from, animek.error, id)
            const res_animek = `${animek.result}\n\n${animek.sinopsis}`
            client.sendFileFromUrl(from, animek.thumb, 'dewabatch.jpg', res_animek, id)
            break
        case '#nh':
            if (!isOwner) return
            //if (isGroupMsg) return client.reply(from, 'Sorry this command for private chat only!', id)
            if (args.length === 2) {
                const nuklir = body.split(' ')[1]
                client.reply(from, mess.wait, id)
                const cek = await nhentai.exists(nuklir)
                if (cek === true)  {
                    try {
                        const api = new API()
                        const pic = await api.getBook(nuklir).then(book => {
                            return api.getImageURL(book.cover)
                        })
                        const dojin = await nhentai.getDoujin(nuklir)
                        const { title, details, link } = dojin
                        const { parodies, tags, artists, groups, languages, categories } = await details
                        var teks = `*Title* : ${title}\n\n*Parodies* : ${parodies}\n\n*Tags* : ${tags.join(', ')}\n\n*Artists* : ${artists.join(', ')}\n\n*Groups* : ${groups.join(', ')}\n\n*Languages* : ${languages.join(', ')}\n\n*Categories* : ${categories}\n\n*Link* : ${link}`
                        exec('nhentai --id=' + nuklir + ` -P mantap.pdf -o ./hentong/${nuklir}.pdf --format `+ `${nuklir}.pdf`, (error, stdout, stderr) => {
                            client.sendFileFromUrl(from, pic, 'hentod.jpg', teks, id).then(() => 
                            client.sendFile(from, `./hentong/${nuklir}.pdf/${nuklir}.pdf.pdf`, `${title}.pdf`, '', id)).catch(() => 
                            client.sendFile(from, `./hentong/${nuklir}.pdf/${nuklir}.pdf.pdf`, `${title}.pdf`, '', id))
                            /*if (error) {
                                console.log('error : '+ error.message)
                                return
                            }
                            if (stderr) {
                                console.log('stderr : '+ stderr)
                                return
                            }
                            console.log('stdout : '+ stdout)*/
                           /* })
                    } catch (err) {
                        client.reply(from, '[❗] Terjadi kesalahan, mungkin kode nuklir salah', id)
                    }
                } else {
                    client.reply(from, '[❗] Kode nuClear Salah!')
                }
            } else {
                client.reply(from, '[ WRONG ] Kirim perintah *!nh [nuClear]* untuk contoh kirim perintah *!readme*')
            }
        	break*/ 
        case '#brainly':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length >= 2){
                const BrainlySearch = require('./lib/brainly')
                let tanya = body.slice(9)
                let jum = Number(tanya.split('.')[1]) || 2
                if (jum > 10) return client.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                client.reply(from, `➸ *Pertanyaan* : ${tanya.split('.')[0]}\n\n➸ *Jumlah jawaban* : ${Number(jum)}`, id)
                await BrainlySearch(tanya.split('.')[0],Number(jum), function(res){
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            client.reply(from, `➸ *Pertanyaan* : ${x.pertanyaan}\n\n➸ *Jawaban* : ${x.jawaban.judulJawaban}\n`, id)
                        } else {
                            client.reply(from, `➸ *Pertanyaan* : ${x.pertanyaan}\n\n➸ *Jawaban* 〙: ${x.jawaban.judulJawaban}\n\n➸ *Link foto jawaban* : ${x.jawaban.fotoJawaban.join('\n')}`, id)
                        }
                    })
                })
            } else {
                client.reply(from, 'Usage :\n#brainly [pertanyaan] [.jumlah]\n\nEx : \n#brainly NKRI .2', id)
            }
            break
        /*case '!wait':
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Searching....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		client.reply(from, 'Maaf, saya tidak tau ini anime apa', id)
                	}
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                    }
                    teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *Ecchi* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'Error !', id)
                })
            } else {
                client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Neh contoh mhank!', id)
            }
            break*/
        case '#quotemaker':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            arg = body.trim().split('.')
            if (arg.length >= 4) {
                client.reply(from, mess.wait, id)
                const quotes = arg[1]
                const author = arg[2]
                const theme = arg[3]
                await quotemaker(quotes, author, theme).then(amsu => {
                    client.sendFile(from, amsu, 'quotesmaker.jpg','neh...').catch(() => {
                       client.reply(from, mess.error.Qm, id)
                    })
                })
            } else {
                client.reply(from, 'Usage: \n#quotemaker .teks.watermark.theme\n\nEx :\n#quotemaker .ini contoh.bicit.random', id)
            }
            break       
        case '#linkgroup':
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
            } else {
            	client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            }
            break
        /*case '!bc':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) await client.sendText(ids, `[ Shinomiya Kaguya BOT Broadcast ]\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', id)
            break*/
        case '#adminlist':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await sleep(2000)
            await client.sendTextWithMentions(from, mimin)
            break
        case '#ownergroup':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break
        case '#mentionall':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Mention All 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 LordZ BOT 〙'
            await sleep(2000)
            await client.sendTextWithMentions(from, hehe)
            break
        case '#kickall':
            /*if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }*/
            client.reply(from, 'Bahaya!!! jadi fitur ini di matikan hehehehe', id)
            break
        case '#leaveall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Succes leave all group!', id)
            break
        case '#clearall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Succes clear all chat!', id)
            break
        case '#add':
            const orang = args[1]
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (args.length === 1) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!add* 628xxxxx', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            try {
                await client.addParticipant(from,`${orang}@c.us`)
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
        case '#kick':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *#kick* @tagmember', id)
            await client.sendText(from, `Perintah diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case '#leave':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            await client.sendText(from,'Sayonara').then(() => client.leaveGroup(groupId))
            break
        case '#promote':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!promote* @tagmember', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break
        case '#demote':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!demote* @tagadmin', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
            break
        case '#join':
            if (isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan private chat dengan botnya', id)
            if (!isOwner) return client.reply(from, 'Join ke gc lain? konfirm dulu ke owner.', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#join* linkgroup\n\nEx:\n#join https://chat.whatsapp.com/blablablablablabla', id)
            const link = body.slice(6)
            const tGr = await client.getAllGroups()
            const minMem = 5
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, 'Ini link? 👊🤬', id)
            //if (tGr.length > 15) return client.reply(from, 'Maaf jumlah group sudah maksimal!', id)
            //if (check.size < minMem) return client.reply(from, 'Member group tidak melebihi 5, bot tidak bisa masuk', id)
            if (check.status === 200) {
                await client.joinGroupViaLink(link).then(() => client.reply(from, 'Bot akan segera masuk!'))
            } else {
                client.reply(from, 'Link group tidak valid!', id)
            }
            break
        case '#delete':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!quotedMsg) return client.reply(from, 'Salah!!, kirim perintah *#delete [tagpesanbot]*', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Salah!!, Bot tidak bisa mengahpus chat user lain!', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case '#getses':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)        
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', 'Neh...', id)
            break
        case '#lirik':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length == 1) return client.reply(from, 'Kirim perintah *#lirik [optional]*, contoh *#lirik aku bukan boneka*', id)
            const lagu = body.slice(7)
            const lirik = await liriklagu(lagu)
            client.reply(from, lirik, id)
            break
        case '#chord':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#chord [query]*, contoh *#chord aku bukan boneka*', id)
            const query__ = body.slice(7)
            const chord = await get.get('https://api.i-tech.id/tools/chord?key=ZEL5ZL-Wm5Psl-66gG9x-W3FHEa-97bm8g&query='+ query__).json()
            if (chord.error) return client.reply(from, chord.error, id)
            client.reply(from, chord.result, id)
            break
        case '#artinama':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#artinama [nama]*, contoh *#artinama ijmal*', id)
            const artihah = body.slice(10)
            const arte = await get.get('https://api.vhtear.com/artinama?nama='+artihah+'&apikey=botnolepbydandyproject').json()
            const { hasil } = arte.result
            client.reply(from, hasil, id)
            break
        case '#cekjodoh':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#cekjodoh [nama-nama]*, contoh *#cekjodoh ijmal-yal*', id)
            const cekjo = body.slice(10)
            const doh = await get.get('https://api.i-tech.id/tools/cekjodoh?key=ZEL5ZL-Wm5Psl-66gG9x-W3FHEa-97bm8g&query='+cekjo).json()
            client.reply(from, doh.result, id)
            break            
        /*case '#zodiak':
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#zodiak _.nama.tglLahir_*, contoh *#zodiak _.ijmal.01/12/2003_*', id)
            arg = body.trim().split('.')
            if (arg.length >= 3) {
            const namemu = arg[1]
            const tgllahirmu = arg[2]
            const iak = await get.get(from, `https://api.i-tech.id/tools/zodiak?key=ZEL5ZL-Wm5Psl-66gG9x-W3FHEa-97bm8g&nama=${namemu}&tgl=${tgllahirmu}`,id)
            const muuuu = `➸ *Nama* : ${nama.iak.result}\n➸ *Lahir* : ${lahir.iak.result}\n➸ *Usia* : ${usia.iak.result}\n➸ *Ulang Tahun* : ${ultah.iak.result}\n➸ *Zodiakmu* : ${zodiak.iak.result}`
            client.reply(from, muuuu, id)}
            break                   
       /* case '!listdaerah':
            const listDaerah = await get('https://mhankbarbar.herokuapp.com/daerah').json()
            client.reply(from, listDaerah, id)
            break
        case '!listblock':
            let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            client.sendTextWithMentions(from, hih, id)
            break*/
        case '#jadwalshalat':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, '[❗] Kirim perintah *#jadwalShalat [daerah]*\ncontoh : *#jadwalShalat Tangerang*\nUntuk list daerah kirim perintah *!listDaerah*')
            const daerah = body.slice(14)
            const jadwalShalat = await get.get(`https://mhankbarbar.herokuapp.com/api/jadwalshalat?daerah=${daerah}&apiKey=IsDssiTLL9hE7ofCV1Ot`).json()
            if (jadwalShalat.error) return client.reply(from, jadwalShalat.error, id)
            const { Imsyak, Subuh, Dhuha, Dzuhur, Ashar, Maghrib, Isya } = await jadwalShalat
            arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            tgl = new Date().getDate()
            bln = new Date().getMonth()
            thn = new Date().getFullYear()
            const resultJadwal = `Jadwal shalat di ${daerah}, ${tgl}-${arrbulan[bln]}-${thn}\n\nImsyak : ${Imsyak}\nSubuh : ${Subuh}\nDhuha : ${Dhuha}\nDzuhur : ${Dzuhur}\nAshar : ${Ashar}\nMaghrib : ${Maghrib}\nIsya : ${Isya}`
            client.reply(from, resultJadwal, id)
            break
        case '#listchannel':
            client.reply(from, listChannel, id)
            break
        case '#jadwaltv':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#jadwalTv [channel]*', id)
            const query = body.slice(10).toLowerCase()
            const jadwal = await jadwalTv(query)
            client.reply(from, jadwal, id)
            break
        case '#jadwaltvnow':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            const jadwalNow = await get.get('https://api.haipbis.xyz/jadwaltvnow').json()
            client.reply(from, `Jam : ${jadwalNow.jam}\n\nJadwalTV : ${jadwalNow.jadwalTV}`, id)
            break
        //case '#sendowner':
            client.sendContact(from, '6289673766582@c.us' ,isLordzOwner)
            break            
        /*case '!loli':
            const loli = await get.get('https://mhankbarbar.herokuapp.com/api/randomloli').json()
            client.sendFileFromUrl(from, loli.result, 'loli.jpeg', 'Lolinya om', id)
            break
        case '!waifu':
            const waifu = await get.get('https://mhankbarbar.herokuapp.com/api/waifu').json()
            client.sendFileFromUrl(from, waifu.image, 'Waifu.jpg', `➸ Name : ${waifu.name}\n➸ Description : ${waifu.desc}\n\n➸ Source : ${waifu.source}`, id)
            break
        case '!husbu':
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            client.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break
        case '!randomhentai':
            if (isGroupMsg) {
                if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id)
                const hentai = await randomNimek('hentai')
                if (hentai.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, hentai, `Hentai${ext}`, 'Hentai!', id)
                break
            } else {
                const hentai = await randomNimek('hentai')
                if (hentai.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, hentai, `Hentai${ext}`, 'Hentai!', id)
            }
        case '!randomnsfwneko':
            if (isGroupMsg) {
                if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id)
                const nsfwneko = await randomNimek('nsfw')
                if (nsfwneko.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, nsfwneko, `nsfwNeko${ext}`, 'Nsfwneko!', id)
            } else {
                const nsfwneko = await randomNimek('nsfw')
                if (nsfwneko.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, nsfwneko, `nsfwNeko${ext}`, 'Nsfwneko!', id)
            }
            break
        case '!randomnekonime':
            const nekonime = await get.get('https://mhankbarbar.herokuapp.com/api/nekonime').json()
            if (nekonime.result.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, nekonime.result, `Nekonime${ext}`, 'Nekonime!', id)
            break
        case '!randomtrapnime':
            const trap = await randomNimek('trap')
            if (trap.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, trap, `trapnime${ext}`, 'Trapnime!', id)
            break
        case '!randomanime':
            const nime = await randomNimek('anime')
            if (nime.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, nime, `Randomanime${ext}`, 'Randomanime!', id)
            break
        /*case '!inu':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Inu')
            break
        case '!neko':
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
            break
        case '!pokemon':
            q7 = Math.floor(Math.random() * 890) + 1;
            client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',)
            break*/
        case '#ssweb':
            if (args.length <= 2 || args.length >= 4) return await client.reply(from, 'Screenshot dari web.\npenggunaan : *#ssweb [url] [dimensi]*\nContoh dimensi : 800x600\ncontoh *#ssweb youtube.com 800x600*', id)
            if (args.length > 2){
            const urlweb = args[1]
            const dimensi = args[2]
            const captiions = `Menampilkan hasil ss ${urlweb} dengan dimensi ${dimensi}`
            client.sendFileFromUrl(from, `https://api.screenshotmachine.com/?key=47b84d&url=${urlweb}&dimension=${dimensi}`, 'ssinweb.jpeg', captiions, id).then(apatu => console.log(apatu)).catch(err => {
                client.reply(from, 'Link gagal diakses!', id)
            })
            // const imgss = `https://api.screenshotmachine.com/?key=47b84d&url=${urlweb}&dimension=${dimensi}`
            // const hasimgss = await get.get(imgss)
            // const databs64 = Buffer.from(hasimgss).toString('base64')
            // const captiions = `Menampilkan hasil ss ${urlweb} dengan dimensi ${dimensi}`
            
            }
            break 
        case '#mememaker':
                if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
                arg = body.trim().split('.')
                if (arg.length >= 4) {
                const temanya = arg[1]
                const tekss1 = arg[2]
                const tekss2= arg[3]
            client.sendFileFromUrl(from, `https://api.memegen.link/images/${temanya}/${tekss1}/${tekss2}`,'memem.jpg', '_Dah jadi Nih.._', id).then(apatuch => console.log(apatuch)).catch(err => {
                })
            } else {
                client.reply(from, `${theme_meme}`, id)
            }
            break    
        case '#quote':
        case '#quotes':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            const quotes = await get.get('https://mhankbarbar.herokuapp.com/api/randomquotes').json()
            client.reply(from, `➸ *Quotes* : ${quotes.quotes}\n➸ *Author* : ${quotes.author}`, id)
            break
        case '#quotesnime':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            const skya = await get.get('https://api.haipbis.xyz/randomanimequotes').json()
            client.reply(from, `➸ *Quotes* : ${skya.quotes}\n➸ *Author* : ${skya.author}\n➸ *Anime* : ${skya.anime}`, id)
            break
        case '#meme':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
            const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
            client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break
        case '#lapor':
            if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6289673766582 untuk pertanyaan lebih lanjut', id)        
            if (args.length === 1) return client.reply(from, `Kirim laporan bug dengan cara ketik perintah :\n*#lapor* _Ketik pesan_\nContoh :\n*#lapor* _Min ada bug_`, id)
            const lapor = body.slice(5)
            await client.sendText(ownerNumber, `*LAPOR!!!* :\n\n*From* ${pushname} wa.me/${sender.id.replace('@c.us','')}\n*Content* : ${lapor}\n*TimeStamp* : ${time}`).then(() => client.reply(from, `_[DONE] Laporan telah terkirim, mohon kirim laporan dengan jelas atau kami tidak akan menerima laporan tersebut!_`, id))
            break                              
        case 'P' :    
        case '#help':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            client.sendText(from, help)
            break
        case '#readme':
            client.reply(from, readme, id)
            break
        case '#menu':
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            if(isMsgLimit(serial)){
                    return
                }else{
                    await addMsgLimit(serial)
            }
            await limitAdd(serial)
            client.sendText(from, help)
            break    
        case '#info':
            client.sendLinkWithAutoPreview(from, 'https://github.com/ijmalan/lordz-bot', info)
            client.sendContact(from, '6289673766582@c.us' ,isLordzOwner)
            break
        case '#snk':
            client.reply(from, snk, id)
            break
         default:
            if (command.startsWith('#')) {
                client.reply(from, `Hai ${pushname} sayangnya.. bot tidak mengerti perintah ${args[0]}, mohon ketik *#menu*\n\nDan ketik *#limit* untuk cek sisa limit request anda`, id)
            }    
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
