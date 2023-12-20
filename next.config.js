
//const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
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
    return {
        ...base
        /* development only config options here */
    }
}