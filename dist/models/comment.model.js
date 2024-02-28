"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.commentSchema = new mongoose_1.Schema({
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', require: true }
}, {
    timestamps: true
});
const CommentModel = (0, mongoose_1.model)('comments', exports.commentSchema);
exports.default = CommentModel;
