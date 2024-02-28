"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../common/constant");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: constant_1.UserRole, default: constant_1.UserRole.MEMBER }
}, {
    timestamps: true
});
const UserModel = (0, mongoose_1.model)('users', userSchema);
exports.default = UserModel;
