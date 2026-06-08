"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        res.status(401).json({ status: 'error', message: 'No token, authorization denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch (err) {
        console.error('JWT Verification Error:', err);
        res.status(401).json({ status: 'error', message: 'Token is not valid' });
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.error('Role Middleware: req.user is undefined');
            res.status(403).json({ status: 'error', message: 'Access denied: No user info' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            console.error(`Role Middleware: User role "${req.user.role}" not in allowed list [${roles}]`);
            res.status(403).json({ status: 'error', message: 'Access denied: Insufficient permissions' });
            return;
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
