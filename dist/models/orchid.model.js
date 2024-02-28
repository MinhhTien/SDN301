"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const comment_model_1 = require("./comment.model");
const orchidSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    original: { type: String, required: true },
    isNatural: { type: Boolean, required: true, default: false },
    slug: { type: String, required: true },
    color: [String],
    comments: { type: [comment_model_1.commentSchema], required: false },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'categories', require: true }
}, {
    timestamps: true
});
const OrchidModel = (0, mongoose_1.model)('orchids', orchidSchema);
exports.default = OrchidModel;
