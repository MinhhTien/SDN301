import express from 'express'
import { OrchidController } from '@controllers/orchid.controller'

const orchidRouter = express.Router()
const orchidController = new OrchidController()

orchidRouter.route('/').get(orchidController.renderAllOrchids).post(orchidController.createOrchid)
orchidRouter.route('/search').post(orchidController.searchOrchids)
orchidRouter.route('/management').get(orchidController.renderManagementOrchids)
orchidRouter.route('/:orchidSlug').get(orchidController.getOrchidById)

orchidRouter.route('/:id').put(orchidController.updateOrchid).delete(orchidController.deleteOrchid)

export default orchidRouter
