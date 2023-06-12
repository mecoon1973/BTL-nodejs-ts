"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = __importDefault(require("../controllers/serviceController"));
const router = (0, express_1.Router)();
require('dotenv').config();
router.get('/', serviceController_1.default.index);
router.post('/', serviceController_1.default.commit_service);
exports.default = router;
