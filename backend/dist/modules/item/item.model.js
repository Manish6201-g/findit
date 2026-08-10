"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ItemSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    color: { type: String, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    date: { type: Date, required: true, index: true },
    time: { type: String },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
        building: { type: String, trim: true },
        floor: { type: String, trim: true },
        roomNumber: { type: String, trim: true },
        description: { type: String, required: true },
    },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
        type: String,
        enum: ['active', 'claimed', 'returned', 'hidden'],
        default: 'active',
        index: true,
    },
    reward: { type: Number, default: 0 },
    additionalNotes: { type: String },
    currentHolder: { type: String }, // For found items
    canDeliver: { type: Boolean, default: false },
    similarityScore: { type: Number }, // AI field
    qrCode: { type: String },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// GeoJSON Index
ItemSchema.index({ location: '2dsphere' });
// Text Search Index
ItemSchema.index({
    title: 'text',
    description: 'text',
    category: 'text',
    brand: 'text',
    model: 'text',
    'location.building': 'text',
});
exports.default = mongoose_1.default.model('Item', ItemSchema);
//# sourceMappingURL=item.model.js.map