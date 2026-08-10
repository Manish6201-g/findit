"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = exports.getMessages = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const getMessages = async (req, res) => {
    const { userId, itemId } = req.query;
    const messages = await Message_1.default.find({
        item: itemId,
        $or: [
            { sender: req.user.id, receiver: userId },
            { sender: userId, receiver: req.user.id },
        ],
    }).sort({ createdAt: 1 });
    res.json(messages);
};
exports.getMessages = getMessages;
const getConversations = async (req, res) => {
    // Get all unique users the current user has chatted with for various items
    const conversations = await Message_1.default.aggregate([
        {
            $match: {
                $or: [{ sender: new req.user.id() }, { receiver: new req.user.id() }],
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $group: {
                _id: {
                    item: '$item',
                    otherUser: {
                        $cond: [
                            { $eq: ['$sender', new req.user.id()] },
                            '$receiver',
                            '$sender',
                        ],
                    },
                },
                lastMessage: { $first: '$content' },
                createdAt: { $first: '$createdAt' },
            },
        },
    ]);
    res.json(conversations);
};
exports.getConversations = getConversations;
// Note: Real message sending will be handled by Socket.io, 
// but we might need a fallback or initial message endpoint.
//# sourceMappingURL=chat.controller.js.map