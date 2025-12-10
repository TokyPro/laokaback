"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await (0, hash_1.hashPassword)(password);
        const user = await prisma_1.default.user.create({
            data: { email, password: hashedPassword, name },
        });
        const token = (0, jwt_1.signToken)({ id: user.id });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await (0, hash_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, jwt_1.signToken)({ id: user.id });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const me = async (req, res, next) => {
    try {
        // req.user is populated by protect middleware
        const authReq = req; // Cast to avoid typescript complaining if AuthRequest isn't exported perfectly
        if (!authReq.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Fetch fresh user data including profile fields
        const user = await prisma_1.default.user.findUnique({
            where: { id: authReq.user.id },
            select: { id: true, email: true, name: true, createdAt: true }
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
