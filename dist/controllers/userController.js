"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserById = exports.getAllUsers = exports.getProfile = exports.logoutAll = exports.logout = exports.refreshToken = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
// Sign Up (Register)
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        // Check if user already exists
        const existingUser = yield User_1.User.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this username or email' });
        }
        // Create new user
        const user = new User_1.User({ username, email, password });
        yield user.save();
        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        // Save refresh token to user
        yield user.addRefreshToken(refreshToken);
        // Prepare response (exclude password and refreshTokens)
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.status(201).json({
            message: 'User created successfully',
            user: userResponse,
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});
exports.signUp = signUp;
// Sign In (Login)
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Find user by username or email
        const user = yield User_1.User.findOne({
            $or: [{ username }, { email: username }]
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        // Save refresh token to user
        yield user.addRefreshToken(refreshToken);
        // Prepare response
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.json({
            message: 'Login successful',
            user: userResponse,
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});
exports.signIn = signIn;
// Refresh Token
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        // Find user and check if refresh token exists
        const user = yield User_1.User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const tokenExists = user.refreshTokens.some((tokenObj) => tokenObj.token === refreshToken);
        if (!tokenExists) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        // Generate new access token
        const newAccessToken = user.generateAccessToken();
        res.json({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        res.status(403).json({ message: 'Invalid refresh token' });
    }
});
exports.refreshToken = refreshToken;
// Logout
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        const user = req.user;
        if (refreshToken && user) {
            // Remove the specific refresh token
            const userDoc = yield User_1.User.findById(user._id);
            if (userDoc) {
                yield userDoc.removeRefreshToken(refreshToken);
            }
        }
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during logout', error: error.message });
    }
});
exports.logout = logout;
// Logout from all devices
const logoutAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.user._id);
        if (user) {
            user.refreshTokens = [];
            yield user.save();
        }
        res.json({ message: 'Logged out from all devices successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during logout', error: error.message });
    }
});
exports.logoutAll = logoutAll;
// Get current user profile (protected route)
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        res.json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});
exports.getProfile = getProfile;
// Get all users (for admin purposes - protected route)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find({}, '-password -refreshTokens');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
// Get user by ID (protected route)
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.params.id, '-password -refreshTokens');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});
exports.getUserById = getUserById;
// Delete user (protected route)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});
exports.deleteUser = deleteUser;
