
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const { links } = require('./constants')

const base = {
    reactStrictMode: true,
    async redirects() {
        return links.map((link) => {
            return {
                source: link.path,
                destination: link.url,
                permanent: true,
            };
        });
    },
};

module.exports = (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            ...base
            /* development only config options here */
        }
    }

    return withPWA({
        ...base,
        pwa: {
            dest: 'public',
            runtimeCaching,
        },
    })
}