module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        cloudinaryCloudName: process.env.CLOUD_NAME,
        cloudinaryPreset: process.env.CLOUD_PRESET,
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'https://carpadi.herokuapp.com/api/v1' // development api
            : 'https://carpadi.herokuapp.com/api/v1' // production api
    },
    compiler: {
        styledComponents: true,
        ssr: true
    }
}
