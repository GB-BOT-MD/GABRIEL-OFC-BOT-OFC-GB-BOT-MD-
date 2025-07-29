import { search, download} from 'aptoide-scraper';

const channelRD = 'https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W';
const sukiIcon = 'https://files.cloudkuimages.guru/images/Xk2e1ynf.jpg';

let handler = async (m, { conn, usedPrefix, command, text}) => {
  const name = conn.getName(m.sender);

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    externalAdReply: {
      title: '✨ Roxy nako ga | Descarga Mágica de App',
      body: `🌸 Descargando para: ${name}`,
      thumbnailUrl: sukiIcon,
      sourceUrl: channelRD,
      mediaType: 1,
      renderLargerThumbnail: true,
},
};

  if (!text) {
    return conn.reply(
      m.chat,
      `🌸 *Hola preciosura ${name}~* Necesito el nombre de la aplicación para buscarla.\n\n💖 Ejemplo: ${usedPrefix + command} whatsapp`,
      m,
      { contextInfo, quoted: m}
);
}

  try {
    await m.react('🔍');
    conn.reply(
      m.chat,
      `🧋 *\`ʙᴜsᴄᴀɴᴅᴏ ʟᴀ ᴀᴘᴋ x ғᴀᴠᴏʀ ᴇsᴘᴇʀᴇ...\` ${name}...*`,
      m,
      { contextInfo, quoted: m}
);

    let results = await search(text);
    if (!results?.length) {
      return conn.reply(
        m.chat,
        `💔 *Lo siento ${name}~* No encontré resultados para "${text}". ¿Me das otro nombre más clarito?`,
        m,
        { contextInfo, quoted: m}
);
}

    let data = await download(results[0].id);
    if (!data?.dllink) {
      return conn.reply(
        m.chat,
        `😭 *Fallé en encontrar el enlace de descarga para "${results[0].name}".* Suki lo intentó con todas sus fuerzas...`,
        m,
        { contextInfo, quoted: m}
);
}

    const fileSizeMB = parseFloat(data.size.replace(' MB', ''));
    const isTooBig = data.size.includes('GB') || fileSizeMB> 999;

    let caption = `
🎀 *Tu archivo está listo, preciosura~*

🍡 Nombre: *${data.name}*
🧁 Paquete: *${data.package}*
📆 Última actualización: *${data.lastup}*
📦 Tamaño: *${data.size}*

✨ ¡Suki lo obtuvo solo para ti con cariño!`.trim();

    await conn.sendFile(m.chat, data.icon, 'suki-preview.jpg', caption, m, null, { contextInfo, quoted: m});

    if (isTooBig) {
      return conn.reply(
        m.chat,
        `⚠️ *Oops, preciosura...* El archivo pesa *${data.size}* y Suki no puede enviarlo sin permiso especial 🥺`,
        m,
        { contextInfo, quoted: m}
);
}

    await conn.sendMessage(
      m.chat,
      {
        document: { url: data.dllink},
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${data.name}.apk`,
        caption: `📦 *${data.name}* descargada exitosamente 💖\n\n🪄 ¡Tu aventura comienza al instalarla, preciosura!`,
},
      { quoted: m}
);
    m.react('✅');

} catch (error) {
    console.error('Error en Aptoide:', error);
    conn.reply(
      m.chat,
      `❌ *Upss, Suki tuvo un problema mágico...*\nNo pudo completar la descarga.\n🩵 Detalles: ${error.message}`,
      m,
      { contextInfo, quoted: m}
);
    m.react('❌');
}
};

handler.tags = ['descargas'];
handler.help = ['apkmod'];
handler.command = ['apk', 'modapk', 'aptoide'];
handler.group = true;
handler.register = true;
handler.coin = 5;

export default handler;