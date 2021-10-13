
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            /* development only config options here */
        }
    }

    return withPWA({
        pwa: {
            dest: 'public',
            runtimeCaching,
        },
    })
}