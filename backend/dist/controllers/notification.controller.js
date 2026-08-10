"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = async (req, res) => {
    const notifications = await Notification_1.default.find({ user: req.user.id }).sort({
        createdAt: -1,
    });
    res.json(notifications);
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    const notification = await Notification_1.default.findById(req.params.id);
    if (notification) {
        if (notification.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized');
        }
        notification.read = true;
        await notification.save();
        res.json(notification);
    }
    else {
        res.status(404);
        throw new Error('Notification not found');
    }
};
exports.markAsRead = markAsRead;
//# sourceMappingURL=notification.controller.js.map