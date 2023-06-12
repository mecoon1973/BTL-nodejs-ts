"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hotel_1 = require("../models/database/Hotel");
class serviceController {
    static index(req, res, next) {
        res.render('service');
    }
    static service(req, res, next) {
        const user = req.session.user;
        const address = req.body.address;
        const countPerson = req.body.countPerson;
        const countChilden = req.body.countChilden;
        const countRoom = req.body.countRoom;
        // const startDate = req.body.startDate
        // const endDate = req.body.endDate
        const listHotel = Hotel_1.Hotel.findBy({
            Address: address,
        });
        res.redirect('/service/hotel');
    }
    static commit_service(req, res, next) {
    }
}
exports.default = serviceController;
