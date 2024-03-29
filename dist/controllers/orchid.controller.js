"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchidController = void 0;
const formidable_1 = __importDefault(require("formidable"));
const http_status_1 = __importDefault(require("http-status"));
const orchid_model_1 = __importDefault(require("../models/orchid.model"));
const common_1 = require("../utils/common");
const mongodb_1 = require("mongodb");
const category_model_1 = __importDefault(require("../models/category.model"));
const lodash_1 = require("lodash");
const comment_model_1 = __importDefault(require("../models/comment.model"));
const constant_1 = require("../common/constant");
class OrchidController {
    async renderAllOrchids(req, res, next) {
        try {
            const orchids = await orchid_model_1.default.find({}, {}, {
                populate: 'category'
            }).lean();
            const user = req.session.user;
            res.render('./orchids/all', {
                orchids,
                search: 'Search Orchids...',
                isLoggedIn: !!user,
                user: req.session.user
            });
        }
        catch (err) {
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async searchOrchids(req, res, next) {
        try {
            console.log(req.body);
            const orchids = await orchid_model_1.default.find({
                name: { $regex: req.body.search, $options: 'i' }
            }, {}, {
                populate: 'category'
            }).lean();
            res.render('./orchids/all', {
                orchids,
                search: req.body.search,
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
        catch (err) {
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async renderManagementOrchids(req, res, next) {
        try {
            const categories = await category_model_1.default.find({}).lean();
            let orchids = await orchid_model_1.default.find({}, {}, {
                populate: 'category'
            }).lean();
            orchids = orchids.map((orchid) => {
                orchid['categories'] = categories;
                return orchid;
            });
            res.render('./orchids/management', {
                orchids,
                categories,
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
        catch (err) {
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async getOrchidById(req, res) {
        try {
            const orchid = await orchid_model_1.default.findOne({ slug: req.params?.orchidSlug }, {}, {
                populate: ['category', 'comments.author']
            });
            const comment = await comment_model_1.default.findOne({
                orchid: orchid?._id,
                author: req.session.user?._id
            });
            if (!orchid) {
                res.render('404', {
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
                return;
            }
            res.render('./orchids/detail', {
                _id: orchid._id,
                name: orchid.name,
                price: orchid.price,
                image: orchid.image,
                original: orchid.original,
                isNatural: orchid.isNatural,
                color: orchid.color,
                slug: orchid.slug,
                comments: orchid.comments?.map((comment) => comment.toJSON()),
                commentCount: orchid.comments?.length,
                categoryName: (0, lodash_1.get)(orchid, 'category.name'),
                isLoggedIn: !!req.session.user,
                user: req.session.user,
                canComment: req.session.user?.role === constant_1.UserRole.MEMBER && !comment
            });
        }
        catch (err) {
            console.log(err);
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async createOrchid(req, res, next) {
        try {
            const orchid = req.body;
            const colorList = (0, common_1.convertStringToColorArray)(orchid.color);
            const isNatural = 'isNatural' in orchid;
            const category = await category_model_1.default.findById(orchid.categoryId);
            if (category === null) {
                return res.render('400', {
                    errorMessage: `Category not existed. Please try again!`,
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
            }
            const newOrchid = {
                name: orchid.name,
                image: orchid.image,
                original: orchid.original,
                isNatural: isNatural,
                color: colorList,
                price: orchid.price,
                slug: (0, common_1.createSlug)(orchid.name),
                category: category._id
            };
            await orchid_model_1.default.create(newOrchid);
            return res.status(http_status_1.default.CREATED).redirect('/orchids/management');
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError) {
                const { code, keyPattern, keyValue } = err;
                if (code === 11000 && keyPattern['name'] === 1) {
                    res.render('400', {
                        errorMessage: `Orchid name : ${keyValue['name']} has existed. Please try another name!`,
                        isLoggedIn: !!req.session.user,
                        user: req.session.user
                    });
                }
            }
            console.error(err);
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async updateOrchid(req, res, next) {
        try {
            const form = (0, formidable_1.default)({});
            form.parse(req, async (err, fields) => {
                if (err) {
                    return;
                }
                const isNatural = 'isNatural' in fields;
                const colorList = (0, common_1.convertStringToColorArray)(fields.color[0]);
                const category = await category_model_1.default.findById(fields.categoryId[0]);
                if (category === null) {
                    return res.render('400', {
                        errorMessage: `Category not existed. Please try again!`,
                        isLoggedIn: !!req.session.user,
                        user: req.session.user
                    });
                }
                const newOrchid = {
                    name: fields.name[0],
                    image: fields.image[0],
                    original: fields.original[0],
                    isNatural: isNatural,
                    color: colorList,
                    price: Number(fields.price[0]),
                    slug: (0, common_1.createSlug)(fields.name[0]),
                    category: category._id
                };
                const orchid = await orchid_model_1.default.findByIdAndUpdate(req.params.id, newOrchid).lean().exec();
                if (!orchid) {
                    res.status(http_status_1.default.NOT_FOUND).render('404', {
                        isLoggedIn: !!req.session.user,
                        user: req.session.user
                    });
                }
                else {
                    const orchids = await orchid_model_1.default.find({}).lean();
                    res.status(http_status_1.default.OK).render('./orchids/management', {
                        orchids,
                        isLoggedIn: !!req.session.user,
                        user: req.session.user
                    });
                }
            });
        }
        catch (err) {
            if (err instanceof mongodb_1.MongoServerError) {
                const { code, keyPattern, keyValue } = err;
                if (code === 11000 && keyPattern['name'] === 1) {
                    res.render('400', {
                        errorMessage: `Orchid name : ${keyValue['name']} has existed. Please try another name!`,
                        isLoggedIn: !!req.session.user,
                        user: req.session.user
                    });
                }
            }
            console.error(err);
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async deleteOrchid(req, res) {
        try {
            const orchid = await orchid_model_1.default.findByIdAndDelete(req.params.id).lean().exec();
            if (!orchid) {
                res.status(http_status_1.default.NOT_FOUND).render('404', {
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
            }
        }
        catch (err) {
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
}
exports.OrchidController = OrchidController;
