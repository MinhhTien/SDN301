"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = exports.convertStringToColorArray = exports.createSlug = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createSlug = (str) => {
    return str.toLowerCase().replace(/\s+/g, '-');
};
exports.createSlug = createSlug;
const convertStringToColorArray = (color) => {
    if (!color)
        return [];
    const colorArray = color.split(',');
    return colorArray.map((color) => color.trim());
};
exports.convertStringToColorArray = convertStringToColorArray;
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt();
    const hash = await bcryptjs_1.default.hash(password, salt);
    return hash;
};
exports.hashPassword = hashPassword;
const comparePassword = (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
