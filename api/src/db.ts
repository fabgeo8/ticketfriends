import mongoose from 'mongoose'

import logger from '~/logger'
import config from '~/config'

const environment = process.env.NODE_STAGE || 'development'

const connect = async (): Promise<void> => {
  logger.info('connecting to database')

  let connectionString = config.mongodb.url
  if (!connectionString) throw new Error('no mongo db connection string defined')

  // check if connection string needs to be decoded from base64
  if (!connectionString.match(/^mongodb(\+srv)?:\/\//)) {
    const buff = Buffer.from(connectionString, 'base64')
    connectionString = buff.toString('utf-8').trim()
  }

  if (environment === 'development') mongoose.set('debug', true)

  await mongoose.connect(connectionString)
  logger.info('mongodb connected')
}

const disconnect = async (): Promise<void> => {
  await mongoose.connection.close()
  logger.info('mongodb disconnected')
}
export default {
  connect,
  disconnect,
  mongoose,
}
