import pino from 'pino'
import config from '~/config'

const logger = pino()
logger.level = config.logLevel

export default logger
