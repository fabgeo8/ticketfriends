import secrets from './secrets'

export default {
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  mongodb: {
    url: secrets.read(process.env.MONGO_URL_FILE) || process.env.MONGO_URL,
  },
}
