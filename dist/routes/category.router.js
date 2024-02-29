"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const _middlewares_1 = require("../middlewares");
const constant_1 = require("../common/constant");
const categoryRouter = express_1.default.Router();
const categoryController = new category_controller_1.CategoryController();
categoryRouter
    .route('/')
    .get(categoryController.getAllCategories)
    .post((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN]), categoryController.createCategory);
categoryRouter
    .route('/:id')
    .get(categoryController.getCategoryById)
    .put((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN]), categoryController.updateCategory)
    .delete((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN]), categoryController.deleteCategory);
exports.default = categoryRouter;
