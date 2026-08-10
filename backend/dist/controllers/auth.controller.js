"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
const registerUser = async (req, res) => {
    const { name, email, password, rollNumber, department, year, phone } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    // Note: Password hashing should ideally be a pre-save hook in the model, 
    // but I'll add it here for now if the model doesn't have it.
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    const user = await User_1.default.create({
        name,
        email,
        password: hashedPassword,
        rollNumber,
        department,
        year,
        phone,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    // @ts-ignore - password is not in IUser interface yet but is in DB
    if (user && (await bcryptjs_1.default.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
};
exports.loginUser = loginUser;
const getUserProfile = async (req, res) => {
    const user = await User_1.default.findById(req.user.id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            rollNumber: user.rollNumber,
            department: user.department,
            year: user.year,
            phone: user.phone,
            role: user.role,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=auth.controller.js.map