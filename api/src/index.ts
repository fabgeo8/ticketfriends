import express, { Request, Response, RequestHandler, NextFunction } from 'express'
import { HttpError } from 'http-errors'
import apiRoutes from '~/routes/api'
import config from '~/config'
import db from '~/db'

const app = express()

const initServer = async () => {
  await db.connect()

  app.use(express.json() as RequestHandler)

  app.use('/api', apiRoutes)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(error.status || 500)
    res.json({
      status: error.status,
      message: error.message,
    })
  })

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`ticketfriends API listening at http://localhost:${config.port}, Environment: ${config.env}`)
  })
}

initServer()
