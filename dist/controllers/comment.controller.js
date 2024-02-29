"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const comment_model_1 = __importDefault(require("../models/comment.model"));
const orchid_model_1 = __importDefault(require("../models/orchid.model"));
class CommentController {
    async createComment(req, res) {
        try {
            const user = req.session.user;
            const { orchidId, comment } = req.body;
            const commentDoc = await comment_model_1.default.findOne({
                author: user?._id,
                orchid: orchidId
            }).lean();
            if (commentDoc) {
                return res.render('400', {
                    errorMessage: `You have commented this orchid before.`,
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
            }
            const commentDocument = await comment_model_1.default.create({
                comment,
                author: user?._id,
                orchid: orchidId
            });
            console.log(commentDocument.toObject());
            const orchid = await orchid_model_1.default.findById(orchidId);
            orchid?.comments?.push(commentDocument);
            orchid?.save();
            return res.redirect(`/orchids/${orchid?.slug}`);
        }
        catch (err) {
            console.error(err);
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
}
exports.CommentController = CommentController;
