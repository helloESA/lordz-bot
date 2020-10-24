const { default: got } = require('got/dist/source');
const fetch = require('node-fetch')
const { getBase64 } = require("./fetcher")
const request = require('request').defaults({ encoding: null });

const Chordlagu = async (clagu) => {
    const response = await fetch(`https://mhankbarbar.herokuapp.com/api/chord?q=${clagu}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    const json = await response.json()
    if (json.status === 200) return `Chord Lagu ${clagu}\n\n${json.result}`
    return `[ Error ] Chord Lagu ${clagu} tidak di temukan!`
}

const liriklagu = async (lagu) => {
    const response = await fetch(`http://scrap.terhambar.com/lirik?word=${lagu}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    const json = await response.json()
    if (json.status === true) return `Lirik Lagu ${lagu}\n\n${json.result.lirik}`
    return `[ Error ] Lirik Lagu ${lagu} tidak di temukan!`
}

const artinama = async (namaarti) => {
    const response = await fetch(`https://scrap.terhambar.com/nama?n=${namaarti}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    const json = await response.json()
    if (json.status === true) return `Arti dari Nama ${namaarti}\n\n${json.result.arti}`
    return `[ Error ] Arti dari Nama ${namaarti} tidak di temukan!`
}

const quotemaker = async (quotes, author = 'EmditorBerkelas', type = 'random') => {
    var q = quotes.replace(/ /g, '%20').replace('\n','%5Cn')
    const response = await fetch(`https://terhambar.com/aw/qts/?kata=${q}&author=${author}&tipe=${type}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.status) {
        if (json.result !== '') {
            const base64 = await getBase64(json.result)
            return base64
        }
    }
}

const ttsticker = async (teksss) => {
    const response = await fetch(`https://placehold.jp/80/ffffff/000000/520x520.png?text=` + teksss)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.success === true) return {
        'capt': json.title, 'exts': '.png', 'url': json.links.Download_Low_Quality
    }
    return {
        'capt': '[ ERROR ] Not found!', 'exts': '.png', 'url': 'http://mrhrtz-wabot.000webhostapp.com/404.jpg'
    }
}

const fb = async (url) => {
    const response = await fetch(`http://mrhrtz-wabot.000webhostapp.com/FB/apifb.php?url=${url}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.success === true) return {
        'capt': json.title, 'exts': '.mp4', 'url': json.links.Download_Low_Quality
    }
    return {
        'capt': '[ ERROR ] Not found!', 'exts': '.jpg', 'url': 'http://mrhrtz-wabot.000webhostapp.com/404.jpg'
    }
}

const ig = async (urlig) => {
    const response = await fetch(`http://keepsaveit.com/api/?api_key=rMqwqaDTUG5AsJLMS5WDJZAOFkLVyQLFOHhkJeHzJgvrscJMJ5&url=${urlig}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const json = await response.json()
    if (json.status === true) return {
        'capt': `*Title* : ${json.response.title}\n*Resolution* : ${json.response.links.resolution}\n*Size* : ${json.response.links.size}`, 'exts': json.response.links.ext, 'url': json.response.links.url
    }
    return {
        'capt': '[ ERROR ] Not found! Akunnya mungkin private.', 'exts': '.jpg', 'url': 'http://mrhrtz-wabot.000webhostapp.com/404.jpg'
    }
}

const randomNimek = async (type) => {
    var url = 'https://api.computerfreaker.cf/v1/'
    switch(type) {
        case 'nsfw':
            const nsfw = await fetch(url + 'nsfwneko')
            if (!nsfw.ok) throw new Error(`unexpected response ${nsfw.statusText}`)
            const resultNsfw = await nsfw.json()
            return resultNsfw.url
            break
        case 'hentai':
            const hentai = await fetch(url + 'hentai')
            if (!hentai.ok) throw new Error(`unexpected response ${hentai.statusText}`)
            const resultHentai = await hentai.json()
            return resultHentai.url
            break
        case 'anime':
            let anime = await fetch(url + 'anime')
            if (!anime.ok) throw new Error(`unexpected response ${anime.statusText}`)
            const resultNime = await anime.json()
            return resultNime.url
            break       
        case 'neko':
            let neko = await fetch(url + 'neko')
            if (!neko.ok) throw new Error(`unexpected response ${neko.statusText}`)
            const resultNeko = await neko.json()
            return resultNeko.url
            break
        case 'trap':
            let trap = await fetch(url + 'trap')
            if (!trap.ok) throw new Error(`unexpected response ${trap.statusText}`)
            const resultTrap = await trap.json()
            return resultTrap.url
            break
    }
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const jadwalTv = async (query) => {
    const res = await got.get(`https://api.haipbis.xyz/jadwaltv/${query}`).json()
    if (res.error) return res.error
    switch(query) {
        case 'antv':
            return `\t\t[ ANTV ]\n${res.join('\n')}`
            break
        case 'gtv':
            return `\t\t[ GTV ]\n${res.join('\n')}`
            break
        case 'indosiar':
            return `\t\t[ INDOSIAR ]\n${res.join('\n')}`
            break
        case 'inewstv':
            return `\t\t[ iNewsTV ]\n${res.join('\n')}`
            break
        case 'kompastv':
            return `\t\t[ KompasTV ]\n${res.join('\n')}`
            break
        case 'mnctv':
            return `\t\t[ MNCTV ]\n${res.join('\n')}`
            break
        case 'metrotv':
            return `\t\t[ MetroTV ]\n${res.join('\n')}`
            break
        case 'nettv':
            return `\t\t[ NetTV ]\n${res.join('\n')}`
            break
        case 'rcti':
            return `\t\t[ RCTI ]\n${res.join('\n')}`
            break
        case 'sctv':
            return `\t\t[ SCTV ]\n${res.join('\n')}`
            break
        case 'rtv':
            return `\t\t[ RTV ]\n${res.join('\n')}`
            break
        case 'trans7':
            return `\t\t[ Trans7 ]\n${res.join('\n')}`
            break
        case 'transtv':
            return `\t\t[ TransTV ]\n${res.join('\n')}`
            break
        default:
            return '[ ERROR ] Channel TV salah! silahkan cek list channel dengan mengetik perintah *!listChannel*'
            break
    }
}
function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


exports.Chordlagu = Chordlagu;
exports.liriklagu = liriklagu;
exports.quotemaker = quotemaker;
exports.artinama = artinama;
exports.randomNimek = randomNimek;
exports.ttsticker = ttsticker;
exports.fb = fb
exports.ig = ig;
exports.sleep = sleep;
exports.jadwalTv = jadwalTv;
exports.between = between;
