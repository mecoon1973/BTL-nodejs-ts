"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// const express = require('express')
const loginController_1 = __importDefault(require("../controllers/loginController"));
const checkMiddlerWares_1 = __importDefault(require("../middlewares/checkMiddlerWares"));
const passport = require('passport');
const router = (0, express_1.Router)();
require('dotenv').config();
router.get('/', loginController_1.default.index);
router.post('/', loginController_1.default.commit);
router.get('/a', checkMiddlerWares_1.default.checkIsAdmin, loginController_1.default.commit_a);
router.get('/register', loginController_1.default.index_register);
router.post('/register', loginController_1.default.commit_register);
router.get('/reset', loginController_1.default.index_reset);
router.post('/reset', loginController_1.default.commit_reset);
exports.default = router;
