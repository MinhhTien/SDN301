"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.commentSchema = new mongoose_1.Schema({
    comment: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', require: true },
    orchid: { type: mongoose_1.Schema.Types.ObjectId, ref: 'orchids', require: true }
}, {
    timestamps: true
});
const CommentModel = (0, mongoose_1.model)('comments', exports.commentSchema);
exports.default = CommentModel;
