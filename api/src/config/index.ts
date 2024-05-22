import defaultConfig from './default'
import devConfig from './development'
import stagingConfig from './staging'
import productionConfig from './production'

export type Environment = 'development' | 'staging' | 'production'

const environment: Environment = (process.env.NODE_STAGE as Environment) || 'development'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let envConfig: any = {}
switch (environment) {
  case 'development':
    envConfig = devConfig
    break
  case 'staging':
    envConfig = stagingConfig
    break
  case 'production':
    envConfig = productionConfig
  default:
    break
}

const config = { ...defaultConfig, ...envConfig, env: environment }

export default config
