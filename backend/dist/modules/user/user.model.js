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
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // For email/password auth
    rollNumber: { type: String, trim: true },
    department: { type: String, trim: true },
    year: { type: String },
    phone: { type: String, trim: true },
    hostel: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bio: { type: String, maxlength: 500 },
    profilePicture: { type: String },
    role: {
        type: String,
        enum: ['guest', 'student', 'faculty', 'admin', 'super-admin'],
        default: 'student',
    },
    points: { type: Number, default: 0 },
    itemsReturned: { type: Number, default: 0 },
    itemsFound: { type: Number, default: 0 },
    badges: [{ type: String }],
    bookmarks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Item' }],
    refreshToken: { type: String, select: false },
    isEmailVerified: { type: Boolean, default: false },
    otp: {
        code: String,
        expiresAt: Date,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes for search and performance
UserSchema.index({ email: 1 });
UserSchema.index({ rollNumber: 1 });
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=user.model.js.map