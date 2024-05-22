import { Request, Response, Router } from 'express'
import asyncWrapper from 'express-async-handler'
import config from '~/config'

const router = Router()

router.get(
  '/',
  asyncWrapper(async (_req: Request, res: Response) => {
    res.send(`I'm ok. Thanks for asking! Running on ${config.env}...`)
  })
)

export default router
