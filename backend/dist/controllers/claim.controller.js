"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClaimStatus = exports.getClaimById = exports.getClaims = exports.createClaim = void 0;
const Claim_1 = __importDefault(require("../models/Claim"));
const Item_1 = __importDefault(require("../models/Item"));
const Notification_1 = __importDefault(require("../models/Notification"));
const createClaim = async (req, res) => {
    const { item: itemId, description, proofImages } = req.body;
    const item = await Item_1.default.findById(itemId);
    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }
    const claim = await Claim_1.default.create({
        item: itemId,
        claimer: req.user.id,
        description,
        proofImages,
    });
    // Notify the owner of the item
    await Notification_1.default.create({
        user: item.owner,
        title: 'New Claim Received',
        message: `Someone has filed a claim for your item: ${item.name}`,
        type: 'claim',
    });
    res.status(201).json(claim);
};
exports.createClaim = createClaim;
const getClaims = async (req, res) => {
    // Admins can see all claims, users see claims they've made or claims on their items
    let query = {};
    if (req.user.role !== 'admin') {
        // This is a bit simplified; real logic would involve finding items owned by user first
        query = { claimer: req.user.id };
    }
    const claims = await Claim_1.default.find(query)
        .populate('item', 'name type status')
        .populate('claimer', 'name email');
    res.json(claims);
};
exports.getClaims = getClaims;
const getClaimById = async (req, res) => {
    const claim = await Claim_1.default.findById(req.params.id)
        .populate('item')
        .populate('claimer', 'name email phone rollNumber');
    if (claim) {
        // Check authorization
        // @ts-ignore
        if (claim.claimer._id.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized');
        }
        res.json(claim);
    }
    else {
        res.status(404);
        throw new Error('Claim not found');
    }
};
exports.getClaimById = getClaimById;
const updateClaimStatus = async (req, res) => {
    const { status } = req.body;
    const claim = await Claim_1.default.findById(req.params.id).populate('item');
    if (claim) {
        if (req.user.role !== 'admin') {
            // In a real app, the item owner could also approve/reject
            res.status(401);
            throw new Error('Only admins can update claim status currently');
        }
        claim.status = status;
        await claim.save();
        // Notify the claimer
        await Notification_1.default.create({
            user: claim.claimer,
            title: 'Claim Status Updated',
            message: `Your claim for ${
            // @ts-ignore
            claim.item.name} has been ${status}`,
            type: 'claim',
        });
        // If approved, update item status
        if (status === 'approved') {
            // @ts-ignore
            await Item_1.default.findByIdAndUpdate(claim.item._id, { status: 'claimed' });
        }
        res.json(claim);
    }
    else {
        res.status(404);
        throw new Error('Claim not found');
    }
};
exports.updateClaimStatus = updateClaimStatus;
//# sourceMappingURL=claim.controller.js.map