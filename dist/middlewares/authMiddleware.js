"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../config/prisma"));
const protect = async (req, res, next) => {
    let token;
    const authReq = req;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true }
        });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        authReq.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
