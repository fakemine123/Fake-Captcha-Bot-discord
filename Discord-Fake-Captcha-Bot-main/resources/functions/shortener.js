const tinyURL = require('tinyurl')

async function shortener(conteudo) {
    return await new Promise((resolve) => {
        tinyURL.shorten(conteudo, function (res, err) {
            if (err) resolve(conteudo)
            resolve(res)
        })
    })
}

module.exports = (shortener)