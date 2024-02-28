import express from 'express'
import { OrchidController } from '@controllers/orchid.controller'
import { Authorization } from '@middlewares'
import { UserRole } from '@common/constant'

const orchidRouter = express.Router()
const orchidController = new OrchidController()

orchidRouter
  .route('/')
  .get(orchidController.renderAllOrchids)
  .post(Authorization([UserRole.ADMIN]), orchidController.createOrchid)

orchidRouter.route('/search').post(orchidController.searchOrchids)

orchidRouter.route('/management').get(Authorization([UserRole.ADMIN]), orchidController.renderManagementOrchids)

orchidRouter.route('/:orchidSlug').get(orchidController.getOrchidById)

orchidRouter
  .route('/:id')
  .put(Authorization([UserRole.ADMIN]), orchidController.updateOrchid)
  .delete(Authorization([UserRole.ADMIN]), orchidController.deleteOrchid)

export default orchidRouter
