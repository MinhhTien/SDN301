"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orchid_controller_1 = require("../controllers/orchid.controller");
const orchidRouter = express_1.default.Router();
const orchidController = new orchid_controller_1.OrchidController();
orchidRouter.route('/').get(orchidController.renderAllOrchids).post(orchidController.createOrchid);
orchidRouter.route('/search').post(orchidController.searchOrchids);
orchidRouter.route('/management').get(orchidController.renderManagementOrchids);
orchidRouter.route('/:orchidSlug').get(orchidController.getOrchidById);
orchidRouter.route('/:id').put(orchidController.updateOrchid).delete(orchidController.deleteOrchid);
exports.default = orchidRouter;
