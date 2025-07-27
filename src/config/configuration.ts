export default () => ({
    port: process.env.PORT,
    secret: process.env.SECRET,

    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
})