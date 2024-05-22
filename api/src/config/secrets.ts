import fs from 'fs'
import pino from 'pino'

const logger = pino()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dockerSecret: any = {}

dockerSecret.read = function read(secretNameAndPath: string) {
  try {
    return fs.readFileSync(`${secretNameAndPath}`, 'utf8').trim()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      logger.error(`An error occurred while trying to read the secret: ${secretNameAndPath}. Err: ${err}`)
    } else {
      logger.info(`Could not find the secret, probably not running in swarm mode: ${secretNameAndPath}. Err: ${err}`)
    }
    return false
  }
}

export default dockerSecret
