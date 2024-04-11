const {
    webhook
} = require('../../config')

const {
    Webhook
} = require('discord-webhook-node')

const hook = new Webhook({
    'url': webhook,
    'retryOnLimit': true,
    'throwErrors': false
})

hook.setUsername('Lofy')
hook.setAvatar('https://i.pinimg.com/564x/6a/a6/c9/6aa6c970472aec148059dc55f50810af.jpg')

module.exports = (hook)