"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const site_1 = __importDefault(require("./site"));
const login_1 = __importDefault(require("./login"));
const service_1 = __importDefault(require("./service"));
function route(app) {
    app.use('/login', login_1.default);
    app.use('/service', service_1.default);
    app.use('/', site_1.default);
}
exports.default = route;
