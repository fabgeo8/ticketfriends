import { Router } from 'express'

import healthRoutes from './health'
import ticketRoutes from './ticket'

const router = Router()

router.use('/health', healthRoutes)
router.use('/tickets', ticketRoutes)

export default router
