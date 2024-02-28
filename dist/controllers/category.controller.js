"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const category_model_1 = __importDefault(require("../models/category.model"));
class CategoryController {
    async getAllCategories(req, res, next) {
        try {
            const categories = await category_model_1.default.find({}).lean().exec();
            const response = {
                data: categories
            };
            res.status(http_status_1.default.OK).json(response);
        }
        catch (err) {
            next(err);
        }
    }
    async getCategoryById(req, res, next) {
        try {
            const category = await category_model_1.default.findById(req.params.id).lean().exec();
            let status;
            let response;
            if (!category) {
                response = {
                    message: `Category not found!`,
                    data: {}
                };
                status = http_status_1.default.NOT_FOUND;
            }
            else {
                response = {
                    message: 'Data found',
                    data: category
                };
                status = http_status_1.default.OK;
            }
            res.status(status).json(response);
        }
        catch (err) {
            next(err);
        }
    }
    async createCategory(req, res, next) {
        try {
            const category = req.body;
            let status;
            let response;
            if (!Object.keys(category).length) {
                response = {
                    message: `Invalid body payload!`,
                    data: {}
                };
                status = http_status_1.default.BAD_REQUEST;
            }
            else {
                const newCategory = await category_model_1.default.create(category);
                status = http_status_1.default.CREATED;
                response = {
                    message: `Category is created!`,
                    data: newCategory
                };
                status = http_status_1.default.CREATED;
            }
            res.status(status).json(response);
        }
        catch (err) {
            next(err);
        }
    }
    async updateCategory(req, res, next) {
        try {
            let status;
            let response;
            const category = req.body;
            if (!Object.keys(category).length) {
                response = {
                    message: `Body required`,
                    data: {}
                };
                status = http_status_1.default.BAD_REQUEST;
            }
            else {
                const updatedCategory = await category_model_1.default.findByIdAndUpdate(req.params.id, category, { new: true })
                    .lean()
                    .exec();
                if (!updatedCategory) {
                    response = {
                        message: `Category not found!`,
                        data: {}
                    };
                    status = http_status_1.default.NOT_FOUND;
                }
                else {
                    response = {
                        message: 'Category is updated',
                        data: updatedCategory
                    };
                    status = http_status_1.default.OK;
                }
            }
            res.status(status).json(response);
        }
        catch (err) {
            next(err);
        }
    }
    async deleteCategory(req, res, next) {
        try {
            const category = await category_model_1.default.findByIdAndDelete(req.params.id).lean().exec();
            let status;
            let response;
            if (!category) {
                response = {
                    message: `Category not found!`,
                    data: {}
                };
                status = http_status_1.default.NOT_FOUND;
            }
            else {
                response = {
                    message: 'Category is deleted',
                    data: category
                };
                status = http_status_1.default.OK;
            }
            res.status(status).json(response);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CategoryController = CategoryController;
