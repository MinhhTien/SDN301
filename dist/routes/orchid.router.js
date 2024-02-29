"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orchid_controller_1 = require("../controllers/orchid.controller");
const _middlewares_1 = require("../middlewares");
const constant_1 = require("../common/constant");
const orchidRouter = express_1.default.Router();
const orchidController = new orchid_controller_1.OrchidController();
orchidRouter
    .route('/')
    .get(orchidController.renderAllOrchids)
    .post((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN]), orchidController.createOrchid);
orchidRouter.route('/search').post(orchidController.searchOrchids);
orchidRouter.route('/management').get((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN]), orchidController.renderManagementOrchids);
orchidRouter.route('/:orchidSlug').get(orchidController.getOrchidById);
orchidRouter
    .route('/:id')
    .put((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN]), orchidController.updateOrchid)
    .delete((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN]), orchidController.deleteOrchid);
exports.default = orchidRouter;
