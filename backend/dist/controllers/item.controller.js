"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.getItemById = exports.getItems = exports.createItem = void 0;
const Item_1 = __importDefault(require("../models/Item"));
const createItem = async (req, res) => {
    const { type, name, category, description, brand, color, date, time, location, images, reward, additionalNotes, currentHolder, canDeliver, } = req.body;
    const item = await Item_1.default.create({
        type,
        name,
        category,
        description,
        brand,
        color,
        date,
        time,
        location,
        images,
        owner: req.user.id,
        reward,
        additionalNotes,
        currentHolder,
        canDeliver,
    });
    if (item) {
        res.status(201).json(item);
    }
    else {
        res.status(400);
        throw new Error('Invalid item data');
    }
};
exports.createItem = createItem;
const getItems = async (req, res) => {
    const { type, category, status, search } = req.query;
    const query = {};
    if (type)
        query.type = type;
    if (category)
        query.category = category;
    if (status)
        query.status = status;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
        ];
    }
    const items = await Item_1.default.find(query).sort({ createdAt: -1 }).populate('owner', 'name email');
    res.json(items);
};
exports.getItems = getItems;
const getItemById = async (req, res) => {
    const item = await Item_1.default.findById(req.params.id).populate('owner', 'name email phone');
    if (item) {
        res.json(item);
    }
    else {
        res.status(404);
        throw new Error('Item not found');
    }
};
exports.getItemById = getItemById;
const updateItem = async (req, res) => {
    const item = await Item_1.default.findById(req.params.id);
    if (item) {
        if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized to update this item');
        }
        const updatedItem = await Item_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updatedItem);
    }
    else {
        res.status(404);
        throw new Error('Item not found');
    }
};
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    const item = await Item_1.default.findById(req.params.id);
    if (item) {
        if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized to delete this item');
        }
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    }
    else {
        res.status(404);
        throw new Error('Item not found');
    }
};
exports.deleteItem = deleteItem;
//# sourceMappingURL=item.controller.js.map