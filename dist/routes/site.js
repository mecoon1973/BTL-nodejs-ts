"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const siteController_1 = __importDefault(require("../controllers/siteController"));
const router = (0, express_1.Router)();
require('dotenv').config();
router.get('/', siteController_1.default.index);
exports.default = router;
