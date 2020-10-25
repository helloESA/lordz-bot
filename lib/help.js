function help() {
    return `
   *❚█══LORDZ-BOT══█❚*

  ☾ Perintah Download ☽

-► *#ytmp3 [linkYt]*
-► *#ytmp4 [linkYt]*
-► *#ig [linkIg]*
-► *#fb [linkFb]* 

  ☾ Fitur Lain ☽
 
-► *#stickernobg* 
-► *#sticker*
-► *#ttsticker*
-► *#stimage*
-► *#stickerGif*
-► *#brainly [kata kunci] [jumlah jawaban]*
-► *#jadwalShalat [daerah]*
-► *#jadwalTv [channel]*
-► *#tts [kode bhs] [teks]*
-► *#artinama*
-► *#meme*
-► *#quotemaker [.teks.author.theme]*
-► *#join [linkGroup]*
-► *#quotes*
-► *#quotesnime*
-► *#lirik [optional]*
-► *#chord [query]*
-► *#info*
-► *#donasi*

  ☾ Perintah Grup ☽

-► *#add 62858xxxxx*
-► *#kick @tagmember*
-► *#promote @tagmember*
-► *#demote @tagadmin*
-► *#mentionAll*
-► *#adminList*
-► *#ownerGroup*
-► *#leave*
-► *#linkGroup*
-► *#delete [replyChatBot]*
-► *#kickAll*
  
    _LordZ_BOT @ 2020_

    *Jika Bot Delay bisa laporkan ke owner Bot : wa.me/6289673766582*
    
    _Kirim perintah *#readme* untuk mengetahui fungsi dan cara penggunaan perintah di atas, WAJIB BACA!!._ `
 }
exports.help = help()
function def() {
   return `
   Hai.. Terima Kasih telah menghubungi LordZ BOT 😊
Ketik *#menu* untuk memulai.`
}
exports.def = def()
function tts_list() {
    return `*Data bahasa salah!*

_#tts [data bahasa] [teksnya]_
contoh :
_#tts id Hari yang cerah_

*List data bahasa yang dikenal :*

  af: Afrikaans
  sq: Albanian
  ar: Arabic
  hy: Armenian
  ca: Catalan
  zh: Chinese
  zh-cn: Chinese (Mandarin/China)
  zh-tw: Chinese (Mandarin/Taiwan)
  zh-yue: Chinese (Cantonese)
  hr: Croatian
  cs: Czech
  da: Danish
  nl: Dutch
  en: English
  en-au: English (Australia)
  en-uk: English (United Kingdom)
  en-us: English (United States)
  eo: Esperanto
  fi: Finnish
  fr: French
  de: German
  el: Greek
  ht: Haitian Creole
  hi: Hindi
  hu: Hungarian
  is: Icelandic
  id: Indonesian
  it: Italian
  ja: Japanese
  ko: Korean
  la: Latin
  lv: Latvian
  mk: Macedonian
  no: Norwegian
  pl: Polish
  pt: Portuguese
  pt-br: Portuguese (Brazil)
  ro: Romanian
  ru: Russian
  sr: Serbian
  sk: Slovak
  es: Spanish
  es-es: Spanish (Spain)
  es-us: Spanish (United States)
  sw: Swahili
  sv: Swedish
  ta: Tamil
  th: Thai
  tr: Turkish
  vi: Vietnamese
  cy: Welsh
`}
exports.tts_list = tts_list()
function readme() {
    return `
*[linkYt]* Diisi dengan link YouTube yang valid tanpa tanda “[” dan “]”
Contoh : *#ytmp3 https://youtu.be/Bskehapzke8*

*[linkYt]* Diisi dengan link YouTube yang valid tanpa tanda “[” dan “]”
Contoh : *#ytmp4 https://youtu.be/Bskehapzke8*

*[linkIg]* Diisi dengan link Instagram yang valid tanpa tanda “[” dan “]”
Contoh : *#ig https://www.instagram.com/p/CEcNz0GoA4o/?igshid=11k8kupfuug14*

*[linkFb]* Diisi dengan link Facebook yang valid tanpa tanda “[” dan “]”
Contoh : *#fb https://www.facebook.com/EpochTimesTrending/videos/310155606660409*

*[daerah]* Diisi dengan daerah yang valid, tanpa tanda “[” dan “]”
Contoh : *#jadwalShalat Tangerang*

*[channel]* Diisi dengan channel televisi yang valid, tanpa tanda “[” dan “]”
Contoh : *#jadwalTv Indosiar*

*[tempat]* Diisi dengan tempat/lokasi yang valid, tanpa tanda “[” dan “]“
Contoh : *#cuaca tangerang*

*[kode bhs]* Diisi dengan kode bahasa, contoh *id*, *en*, dll. Dan *[teks]* Diisi dengan teks yang ingin di jadikan voice, Masih sama seperti di atas tanpa tanda “[” dan “]”
Contoh : *#tts id Test*
Note : Max 250 huruf

*[@username]* Diisi dengan username Instagram yang valid, tanpa tanda “[” dan “]”
Contoh : *#igStalk @duar_amjay*

*[.teks.author.theme]* Diisi dengan teks, author, dan theme, tanpa tanda “[” dan “]”
Contoh : *#quotemaker .Odading.Mang Oleh.Shark*

*[linkGroup]* Diisi dengan link group whatsapp yang valid, tanpa tanda “[” dan “]”.
Contoh : *#join https://chat.whatsapp.com/Bhhw77d5t2gjao8*

*[optional]* Diisi dengan teks|title lirik lagu, tanpa tanda “[” dan “]”.
Contoh : *#lirik aku bukan boneka*`
}
exports.readme = readme()
function info() {
    return `

Bot ini di buat dengan bahasa pemrograman Node.js / JavaScript
Nama Bot : LordZ BOT
Tanggal Rilis : 7-Okt-2020
Host Bot : wa.me/6283159125945
Owner Bot : wa.me/6289673766582

*LordZ*`
}
exports.info = info()
function snk() {
    return `Syarat dan Ketentuan *LordZ BOT*
1. Teks dan nama pengguna WhatsApp anda akan kami simpan di dalam server selama bot aktif
2. Data anda akan di hapus ketika bot Offline
3. Kami tidak menyimpan gambar, video, file, audio, dan dokumen yang anda kirim
4. Kami tidak akan pernah meminta anda untuk memberikan informasi pribadi
5. Jika menemukan Bug/Error silahkan langsung lapor ke Owner bot
6. Apapun yang anda perintah pada bot ini, KAMI TIDAK AKAN BERTANGGUNG JAWAB!

Thanks !`
}
exports.snk = snk()
function donate() {
    return `Haiii.. Mau donate ni?
    
Kalo mau donate langsung ae ke :
PULSA/DANA : 089673766582
OVO : 083159125945

Thanks !`
}
exports.donate = donate()
function listChannel() {
    return `Daftar channel: 
1. ANTV
2. GTV
3. Indosiar
4. iNewsTV
5. KompasTV
6. MNCTV
7. METROTV
8. NETTV
9. RCTI
10. SCTV
11. RTV
12. Trans7
13. TransTV`
}
exports.listChannel = listChannel()
