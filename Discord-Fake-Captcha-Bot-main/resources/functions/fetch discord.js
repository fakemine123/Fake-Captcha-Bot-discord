async function fetch_function(url, options) {
    const fetch = (await import('node-fetch')).default
    return await new Promise(async (resolve) => {
        const response = await fetch(url, options)
        const json = await response.json()
        if (json && json.message === 'The resource is being rate limited.') {
            const ms = json.retry_after * 1000
            await new Promise(resolve => setTimeout(resolve, ms))
            return await fetch_function(url, options)
        }
        resolve(json)
    })
}

module.exports = (fetch_function)