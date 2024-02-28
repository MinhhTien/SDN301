"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToColorArray = exports.createSlug = void 0;
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
