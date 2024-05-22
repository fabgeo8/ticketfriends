import secrets from './secrets'

export default {
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  mongodb: {
    url: secrets.read(process.env.MONGO_URL_FILE) || process.env.MONGO_URL,
  },
  ecospeed: {
    apiKey: secrets.read(process.env.ECOSPEED_API_KEY_FILE) || process.env.ECOSPEED_API_KEY,
    apiBaseUrl: 'https://apis.ecospeed.ch/domains/region',
    dataUnit: 1636,
    dataSet: 1571,
  },
}
